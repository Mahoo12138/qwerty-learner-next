import { getQueueToken } from '@nestjs/bullmq';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { AuthService } from './auth.service';
import { ApiTokenEntity } from '../user/entities/api-token.entity';
import { UserService } from '../user/user.service';
import { CreateApiTokenReqDto } from './dto/create-api-token.req.dto';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<UserEntity>;
  let apiTokenRepository: Repository<ApiTokenEntity>;
  let jwtService: JwtService;
  let configService: ConfigService;

  const mockUserRepository = {
    findOneOrFail: jest.fn(),
    findOne: jest.fn(),
  };

  const mockApiTokenRepository = {
    save: jest.fn(),
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    update: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
    verify: jest.fn(),
  };

  const mockConfigService = {
    getOrThrow: jest.fn(),
  };

  const mockCacheManager = {
    store: {
      set: jest.fn(),
      get: jest.fn(),
    },
  };

  const mockEmailQueue = {
    add: jest.fn(),
  };

  const mockUserService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(ApiTokenEntity),
          useValue: mockApiTokenRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
        {
          provide: getQueueToken('email'),
          useValue: mockEmailQueue,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    apiTokenRepository = module.get<Repository<ApiTokenEntity>>(getRepositoryToken(ApiTokenEntity));
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createApiToken', () => {
    it('should create an API token successfully', async () => {
      const userId = 'user-123';
      const dto: CreateApiTokenReqDto = {
        name: 'Test Token',
        expiresAt: '2024-12-31T23:59:59.000Z',
      };

      const mockUser = {
        id: userId,
        role: 'user',
      };

      const mockApiToken = {
        id: 'token-123',
        name: dto.name,
        hash: 'mock-hash',
        userId: userId,
        expiresAt: new Date(dto.expiresAt!),
        save: jest.fn().mockResolvedValue(undefined),
      };

      const mockToken = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        tokenExpires: 1735689599000,
      };

      mockUserRepository.findOneOrFail.mockResolvedValue(mockUser);
      mockApiTokenRepository.save.mockResolvedValue(mockApiToken);
      mockJwtService.signAsync.mockResolvedValue('mock-jwt-token');
      mockConfigService.getOrThrow.mockReturnValue('mock-secret');

      const result = await service.createApiToken(userId, dto);

      expect(result).toEqual({
        id: mockApiToken.id,
        name: mockApiToken.name,
        accessToken: mockToken.accessToken,
        refreshToken: mockToken.refreshToken,
        tokenExpires: mockToken.tokenExpires,
        expiresAt: mockApiToken.expiresAt.toISOString(),
      });

      expect(mockUserRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: userId as any },
        select: ['id', 'role'],
      });
      expect(mockApiTokenRepository.save).toHaveBeenCalled();
    });
  });

  describe('listApiTokens', () => {
    it('should list API tokens successfully', async () => {
      const userId = 'user-123';
      const mockApiTokens = [
        {
          id: 'token-1',
          name: 'Token 1',
          createdAt: new Date('2024-01-15T10:30:00.000Z'),
          expiresAt: new Date('2024-12-31T23:59:59.000Z'),
          lastUsedAt: new Date('2024-01-20T15:45:00.000Z'),
        },
        {
          id: 'token-2',
          name: 'Token 2',
          createdAt: new Date('2024-01-16T10:30:00.000Z'),
          expiresAt: null,
          lastUsedAt: null,
        },
      ];

      mockApiTokenRepository.findAndCount.mockResolvedValue([mockApiTokens, 2]);

      const result = await service.listApiTokens(userId);

      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.items[0].isExpired).toBe(false);
      expect(result.items[1].isExpired).toBe(false);

      expect(mockApiTokenRepository.findAndCount).toHaveBeenCalledWith({
        where: { userId: userId as any },
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('deleteApiToken', () => {
    it('should delete API token successfully', async () => {
      const userId = 'user-123';
      const tokenId = 'token-123';
      const mockApiToken = {
        id: tokenId,
        userId: userId,
      };

      mockApiTokenRepository.findOne.mockResolvedValue(mockApiToken);
      mockApiTokenRepository.remove.mockResolvedValue(undefined);

      await service.deleteApiToken(userId, tokenId);

      expect(mockApiTokenRepository.findOne).toHaveBeenCalledWith({
        where: { id: tokenId as any, userId: userId as any },
      });
      expect(mockApiTokenRepository.remove).toHaveBeenCalledWith(mockApiToken);
    });
  });
});
