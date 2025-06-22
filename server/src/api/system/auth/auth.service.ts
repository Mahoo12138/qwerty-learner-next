import { UserEntity, UserRole } from '@/api/system/user/entities/user.entity';
import { TokenEntity, TokenType } from '@/api/system/user/entities/token.entity';
import { IEmailJob, IVerifyEmailJob } from '@/common/interfaces/job.interface';
import { Branded } from '@/common/types/types';
import { AllConfigType } from '@/config/config.type';
import { SYSTEM_USER_ID } from '@/constants/app.constant';
import { CacheKey } from '@/constants/cache.constant';
import { ErrorCode } from '@/constants/error-code.constant';
import { JobName, QueueName } from '@/constants/job.constant';
import { ValidationException } from '@/common/exceptions/validation.exception';
import { createCacheKey } from '@/utils/cache.util';
import { verifyPassword } from '@/utils/password.util';
import { InjectQueue } from '@nestjs/bullmq';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bullmq';
import { Cache } from 'cache-manager';
import { plainToInstance } from 'class-transformer';
import crypto from 'crypto';
import ms from 'ms';
import { Repository } from 'typeorm';
import { LoginReqDto } from './dto/login.req.dto';
import { LoginResDto } from './dto/login.res.dto';
import { RefreshReqDto } from './dto/refresh.req.dto';
import { RefreshResDto } from './dto/refresh.res.dto';
import { SigninReqDto } from './dto/signin.req.dto';
import { SigninResDto } from './dto/signin.res.dto';
import { CreateApiTokenReqDto } from './dto/create-api-token.req.dto';
import { CreateApiTokenResDto } from './dto/create-api-token.res.dto';
import { ListApiTokensResDto, ApiTokenItemDto } from './dto/list-api-tokens.res.dto';
import { JwtPayloadType } from './types/jwt-payload.type';
import { JwtRefreshPayloadType } from './types/jwt-refresh-payload.type';
import { UserService } from '../user/user.service';

type Token = Branded<
  {
    accessToken: string;
    refreshToken: string;
    tokenExpires: number;
  },
  'token'
>;

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(TokenEntity)
    private readonly tokenRepository: Repository<TokenEntity>,
    @InjectQueue(QueueName.EMAIL)
    private readonly emailQueue: Queue<IEmailJob, any, string>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) { }

  /**
   * Sign in user
   * @param dto LoginReqDto
   * @returns LoginResDto
   */
  async login(dto: LoginReqDto): Promise<LoginResDto> {
    const { email, password } = dto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });

    const isPasswordValid =
      user && (await verifyPassword(password, user.password));

    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const token = new TokenEntity({
      type: TokenType.SESSION,
      hash,
      userId: user.id,
      createdBy: SYSTEM_USER_ID,
      updatedBy: SYSTEM_USER_ID,
    });
    await token.save();

    const jwtToken = await this.createToken({
      id: user.id,
      sessionId: token.id,
      hash,
    });

    return plainToInstance(LoginResDto, {
      userId: user.id,
      ...jwtToken,
    });
  }

  async signin(dto: SigninReqDto): Promise<SigninResDto> {
    // Check if a host user exists
    const hostUser = await this.userService.findHostUser();
    // Determine the role for the new user
    const role = hostUser ? UserRole.USER : UserRole.HOST;
    // Check if the user already exists
    const isExistUser = await UserEntity.exists({
      where: { email: dto.email },
    });

    if (isExistUser) {
      throw new ValidationException(ErrorCode.E003);
    }

    // Register user
    const user = new UserEntity({
      role,
      email: dto.email,
      password: dto.password,
      createdBy: SYSTEM_USER_ID,
      updatedBy: SYSTEM_USER_ID,
    });

    await user.save();

    // Send email verification
    const verificationToken = await this.createVerificationToken({ id: user.id });
    const tokenExpiresIn = this.configService.getOrThrow(
      'auth.confirmEmailExpires',
      {
        infer: true,
      },
    );
    await this.cacheManager.set(
      createCacheKey(CacheKey.EMAIL_VERIFICATION, user.id),
      verificationToken,
      ms(tokenExpiresIn),
    );
    await this.emailQueue.add(
      JobName.EMAIL_VERIFICATION,
      {
        email: dto.email,
        token: verificationToken,
      } as IVerifyEmailJob,
      { attempts: 3, backoff: { type: 'exponential', delay: 60000 } },
    );

    return plainToInstance(SigninResDto, {
      userId: user.id,
    });
  }

  async logout(userToken: JwtPayloadType): Promise<void> {
    await this.cacheManager.store.set<boolean>(
      createCacheKey(CacheKey.SESSION_BLACKLIST, userToken.sessionId),
      true,
      userToken.exp * 1000 - Date.now(),
    );
    await TokenEntity.delete(userToken.sessionId);
  }

  async refreshToken(dto: RefreshReqDto): Promise<RefreshResDto> {
    const { sessionId, hash } = this.verifyRefreshToken(dto.refreshToken);
    const token = await TokenEntity.findOneBy({ id: sessionId });

    if (!token || token.hash !== hash || token.type !== TokenType.SESSION) {
      throw new UnauthorizedException();
    }

    const user = await this.userRepository.findOneOrFail({
      where: { id: token.userId },
      select: ['id'],
    });

    const newHash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    TokenEntity.update(token.id, { hash: newHash });

    return await this.createToken({
      id: user.id,
      sessionId: token.id,
      hash: newHash,
    });
  }

  async verifyAccessToken(token: string): Promise<JwtPayloadType> {
    let payload: JwtPayloadType;
    try {
      payload = this.jwtService.verify(token, {
        secret: this.configService.getOrThrow('auth.secret', { infer: true }),
      });
    } catch {
      throw new UnauthorizedException();
    }

    // Force logout if the session is in the blacklist
    const isSessionBlacklisted = await this.cacheManager.store.get<boolean>(
      createCacheKey(CacheKey.SESSION_BLACKLIST, payload.sessionId),
    );

    if (isSessionBlacklisted) {
      throw new UnauthorizedException();
    }

    return payload;
  }

  /**
   * Create API token for third-party use
   * @param userId User ID
   * @param dto CreateApiTokenReqDto
   * @returns CreateApiTokenResDto
   */
  async createApiToken(userId: string, dto: CreateApiTokenReqDto): Promise<CreateApiTokenResDto> {
    const user = await this.userRepository.findOneOrFail({
      where: { id: userId as any },
      select: ['id', 'role'],
    });

    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const token = new TokenEntity({
      type: TokenType.API,
      name: dto.name,
      hash,
      userId: user.id,
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
      createdBy: user.id,
      updatedBy: user.id,
    });
    await token.save();

    const jwtToken = await this.createToken({
      id: user.id,
      sessionId: token.id,
      hash,
    });

    return plainToInstance(CreateApiTokenResDto, {
      id: token.id,
      name: token.name,
      ...jwtToken,
      expiresAt: token.expiresAt?.toISOString(),
    });
  }

  /**
   * List user's API tokens
   * @param userId User ID
   * @returns ListApiTokensResDto
   */
  async listApiTokens(userId: string): Promise<ListApiTokensResDto> {
    const [tokens, total] = await this.tokenRepository.findAndCount({
      where: { userId: userId as any, type: TokenType.API },
      order: { createdAt: 'DESC' },
    });

    const items = tokens.map(token => {
      return plainToInstance(ApiTokenItemDto, {
        id: token.id,
        name: token.name,
        createdAt: token.createdAt.toISOString(),
        expiresAt: token.expiresAt?.toISOString(),
        lastUsedAt: token.lastUsedAt?.toISOString(),
        isExpired: token.isExpired(),
      });
    });

    return plainToInstance(ListApiTokensResDto, {
      items,
      total,
    });
  }

  /**
   * Delete API token
   * @param userId User ID
   * @param tokenId Token ID
   */
  async deleteApiToken(userId: string, tokenId: string): Promise<void> {
    const token = await this.tokenRepository.findOne({
      where: { id: tokenId as any, userId: userId as any, type: TokenType.API },
    });

    if (!token) {
      throw new NotFoundException('API token not found');
    }

    await this.tokenRepository.remove(token);
  }

  /**
   * Verify API token
   * @param token Access token
   * @returns JwtPayloadType
   */
  async verifyApiToken(token: string): Promise<JwtPayloadType> {
    let payload: JwtPayloadType;
    try {
      payload = this.jwtService.verify(token, {
        secret: this.configService.getOrThrow('auth.secret', { infer: true }),
      });
    } catch {
      throw new UnauthorizedException();
    }

    // Check if the token is an API token
    const tokenEntity = await this.tokenRepository.findOne({
      where: { id: payload.sessionId as any, type: TokenType.API },
    });

    if (!tokenEntity) {
      throw new UnauthorizedException();
    }

    // Check if API token is expired
    if (tokenEntity.isExpired()) {
      throw new UnauthorizedException('API token has expired');
    }

    // Update last used time
    tokenEntity.updateLastUsed();
    await this.tokenRepository.save(tokenEntity);

    return payload;
  }

  private verifyRefreshToken(token: string): JwtRefreshPayloadType {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.getOrThrow('auth.refreshSecret', {
          infer: true,
        }),
      });
    } catch {
      throw new UnauthorizedException();
    }
  }

  private async createVerificationToken(data: { id: string }): Promise<string> {
    return await this.jwtService.signAsync(
      {
        id: data.id,
      },
      {
        secret: this.configService.getOrThrow('auth.confirmEmailSecret', {
          infer: true,
        }),
        expiresIn: this.configService.getOrThrow('auth.confirmEmailExpires', {
          infer: true,
        }),
      },
    );
  }

  private async createToken(data: {
    id: string;
    sessionId: string;
    hash: string;
  }): Promise<Token> {
    const tokenExpiresIn = this.configService.getOrThrow('auth.expires', {
      infer: true,
    });
    const tokenExpires = Date.now() + ms(tokenExpiresIn);

    const [accessToken, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          id: data.id,
          role: '', // TODO: add role
          sessionId: data.sessionId,
        },
        {
          secret: this.configService.getOrThrow('auth.secret', { infer: true }),
          expiresIn: tokenExpiresIn,
        },
      ),
      await this.jwtService.signAsync(
        {
          sessionId: data.sessionId,
          hash: data.hash,
        },
        {
          secret: this.configService.getOrThrow('auth.refreshSecret', {
            infer: true,
          }),
          expiresIn: this.configService.getOrThrow('auth.refreshExpires', {
            infer: true,
          }),
        },
      ),
    ]);
    return {
      accessToken,
      refreshToken,
      tokenExpires,
    } as Token;
  }
}
