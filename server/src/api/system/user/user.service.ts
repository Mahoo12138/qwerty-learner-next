import { CursorPaginationDto } from '@/common/dto/cursor-pagination/cursor-pagination.dto';
import { CursorPaginatedDto } from '@/common/dto/cursor-pagination/paginated.dto';
import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { Uuid } from '@/common/types/common.type';
import { SYSTEM_USER_ID } from '@/constants/app.constant';
import { ErrorCode } from '@/constants/error-code.constant';
import { ValidationException } from '@/common/exceptions/validation.exception';
import { buildPaginator } from '@/utils/cursor-pagination';
import { paginate } from '@/utils/offset-pagination';
import { verifyPassword } from '@/utils/password.util';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import assert from 'assert';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { CreateUserReqDto } from './dto/create-user.req.dto';
import { ListUserReqDto } from './dto/list-user.req.dto';
import { LoadMoreUsersReqDto } from './dto/load-more-users.req.dto';
import { UpdateUserReqDto } from './dto/update-user.req.dto';
import { UpdateProfileReqDto } from './dto/update-profile.req.dto';
import { ChangePasswordReqDto } from './dto/change-password.req.dto';
import { UploadAvatarReqDto } from './dto/upload-avatar.req.dto';
import { UserResDto } from './dto/user.res.dto';
import { UserEntity, UserRole } from './entities/user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) { }

  async create(dto: CreateUserReqDto): Promise<UserResDto> {
    const { username, email, password, role, image } = dto;

    // check uniqueness of username/email
    const user = await this.userRepository.findOne({
      where: [
        {
          username,
        },
        {
          email,
        },
      ],
    });

    if (user) {
      throw new ValidationException(ErrorCode.E001);
    }

    const newUser = new UserEntity({
      username,
      email,
      password,
      image,
      role,
      createdBy: SYSTEM_USER_ID,
      updatedBy: SYSTEM_USER_ID,
    });

    const savedUser = await this.userRepository.save(newUser);
    this.logger.debug(savedUser);

    return plainToInstance(UserResDto, savedUser);
  }

  async findAll(
    reqDto: ListUserReqDto,
  ): Promise<OffsetPaginatedDto<UserResDto>> {
    const query = this.userRepository
      .createQueryBuilder('user')
      .orderBy('user.createdAt', 'DESC');
    const [users, metaDto] = await paginate<UserEntity>(query, reqDto, {
      skipCount: false,
      takeAll: false,
    });
    return new OffsetPaginatedDto(plainToInstance(UserResDto, users), metaDto);
  }

  async loadMoreUsers(
    reqDto: LoadMoreUsersReqDto,
  ): Promise<CursorPaginatedDto<UserResDto>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    const paginator = buildPaginator({
      entity: UserEntity,
      alias: 'user',
      paginationKeys: ['createdAt'],
      query: {
        limit: reqDto.limit,
        order: 'DESC',
        afterCursor: reqDto.afterCursor,
        beforeCursor: reqDto.beforeCursor,
      },
    });

    const { data, cursor } = await paginator.paginate(queryBuilder);

    const metaDto = new CursorPaginationDto(
      data.length,
      cursor.afterCursor,
      cursor.beforeCursor,
      reqDto,
    );

    return new CursorPaginatedDto(plainToInstance(UserResDto, data), metaDto);
  }

  async findOne(id: Uuid): Promise<UserResDto> {
    assert(id, 'id is required');
    const user = await this.userRepository.findOneByOrFail({ id });

    return user.toDto(UserResDto);
  }

  async update(id: Uuid, updateUserDto: UpdateUserReqDto) {
    const user = await this.userRepository.findOneByOrFail({ id });

    user.role = updateUserDto.role;
    user.image = updateUserDto.image;
    user.updatedBy = SYSTEM_USER_ID;

    await this.userRepository.save(user);
  }

  async remove(id: Uuid) {
    await this.userRepository.findOneByOrFail({ id });
    await this.userRepository.softDelete(id);
  }

  async findHostUser(): Promise<UserResDto> {
    const hostUser = await this.userRepository.findOne({
      where: { role: UserRole.HOST },
    });
    return plainToInstance(UserResDto, hostUser);
  }

  // Profile related methods
  async getProfile(userId: Uuid): Promise<UserResDto> {
    const user = await this.userRepository.findOneByOrFail({ id: userId });
    return plainToInstance(UserResDto, user);
  }

  async updateProfile(userId: Uuid, updateProfileDto: UpdateProfileReqDto): Promise<UserResDto> {
    const user = await this.userRepository.findOneByOrFail({ id: userId });

    // Check if username or email is being changed and if it's already taken
    if (updateProfileDto.username && updateProfileDto.username !== user.username) {
      const existingUser = await this.userRepository.findOne({
        where: { username: updateProfileDto.username },
      });
      if (existingUser) {
        throw new ValidationException(ErrorCode.E001);
      }
    }

    if (updateProfileDto.email && updateProfileDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateProfileDto.email },
      });
      if (existingUser) {
        throw new ValidationException(ErrorCode.E001);
      }
    }

    // Update user fields
    if (updateProfileDto.username) {
      user.username = updateProfileDto.username;
    }
    if (updateProfileDto.email) {
      user.email = updateProfileDto.email;
    }
    if (updateProfileDto.bio) {
      user.bio = updateProfileDto.bio;
    }
    if (updateProfileDto.image) {
      user.image = updateProfileDto.image;
    }

    user.updatedBy = userId;
    const savedUser = await this.userRepository.save(user);

    return plainToInstance(UserResDto, savedUser);
  }

  async changePassword(userId: Uuid, changePasswordDto: ChangePasswordReqDto): Promise<void> {
    const user = await this.userRepository.findOneByOrFail({ id: userId });

    // Verify current password
    const isCurrentPasswordValid = await verifyPassword(
      changePasswordDto.currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      throw new ValidationException(ErrorCode.E002); // Assuming E002 is for invalid password
    }

    // Update password (the hashPassword will be called automatically by BeforeUpdate hook)
    user.password = changePasswordDto.newPassword;
    user.updatedBy = userId;

    await this.userRepository.save(user);
  }

  async uploadAvatar(userId: Uuid, uploadAvatarDto: UploadAvatarReqDto): Promise<UserResDto> {
    const user = await this.userRepository.findOneByOrFail({ id: userId });

    // Validate base64 image data
    const { avatar } = uploadAvatarDto;
    
    // Check if it's a valid base64 image
    if (!avatar.startsWith('data:image/')) {
      throw new ValidationException(ErrorCode.E004); // Invalid image format
    }

    // Check file size (limit to 1MB)
    const base64Data = avatar.split(',')[1];
    const fileSizeInBytes = Math.ceil((base64Data.length * 3) / 4);
    const maxSizeInBytes = 1024 * 1024; // 1MB

    if (fileSizeInBytes > maxSizeInBytes) {
      throw new ValidationException(ErrorCode.E005); // File too large
    }

    // Update user avatar
    user.image = avatar;
    user.updatedBy = userId;

    const savedUser = await this.userRepository.save(user);
    return plainToInstance(UserResDto, savedUser);
  }
}
