import { Uuid } from '@/common/types/common.type';
import { Injectable } from '@nestjs/common';
import assert from 'assert';
import { plainToInstance } from 'class-transformer';
import { SystemSettingResDto } from './dto/system-setting.res.dto';
import { UpsertSettingReqDto } from './dto/upsert-setting.req.dto';
import { UserSettingResDto } from './dto/user-setting.res.dto';
import { SystemSettingEntity } from './entities/system-setting.entity';
import { UserSettingEntity } from './entities/user-setting.entity';

@Injectable()
export class SettingService {
  constructor() {}

  async findAllSystemSettings(): Promise<SystemSettingResDto[]> {
    const settings = await SystemSettingEntity.find();
    return settings.map((setting) =>
      plainToInstance(
        SystemSettingResDto,
        {
          name: setting.name,
          description: setting.description,
          content: setting.content,
        },
        { excludeExtraneousValues: true },
      ),
    );
  }

  async findAllUserSettings(userId: Uuid): Promise<UserSettingResDto[]> {
    assert(userId, 'userId is required');
    const settings = await UserSettingEntity.find({
      where: { userId },
    });

    return settings.map((setting) =>
      plainToInstance(
        UserSettingResDto,
        {
          name: setting.name,
          description: setting.description,
          content: setting.content,
        },
        { excludeExtraneousValues: true },
      ),
    );
  }

  async upsertSystemSetting(
    reqDto: UpsertSettingReqDto,
    userId: Uuid,
  ): Promise<SystemSettingResDto> {
    const { name, description, content } = reqDto;

    let setting = await SystemSettingEntity.findOne({
      where: { name },
    });

    if (!setting) {
      setting = new SystemSettingEntity({
        name,
        description,
        content,
        createdBy: userId,
        updatedBy: userId,
      });
    } else {
      setting.description = description;
      setting.content = content;
    }

    await setting.save();

    return plainToInstance(
      SystemSettingResDto,
      {
        name: setting.name,
        description: setting.description,
        content: setting.content,
      },
      { excludeExtraneousValues: true },
    );
  }

  async upsertUserSetting(
    reqDto: UpsertSettingReqDto,
    userId: Uuid,
  ): Promise<UserSettingResDto> {
    assert(userId, 'userId is required');
    const { name, description, content } = reqDto;

    let setting = await UserSettingEntity.findOne({
      where: { name, userId },
      relations: ['user'],
    });

    if (!setting) {
      setting = new UserSettingEntity({
        name,
        description,
        content,
        userId,
        createdBy: userId,
        updatedBy: userId,
      });
    } else {
      setting.description = description;
      setting.content = content;
    }

    await setting.save();

    return plainToInstance(
      UserSettingResDto,
      {
        name: setting.name,
        description: setting.description,
        content: setting.content,
      },
      { excludeExtraneousValues: true },
    );
  }

  async findAllSystemSettingsForPublic(): Promise<{
    [key: string]: string | undefined;
  }> {
    const settings = await this.findAllSystemSettings();
    const flattenedSettings: { [key: string]: string | undefined } = {};
    settings.forEach((setting) => {
      flattenedSettings[setting.name] = setting.content;
    });
    return flattenedSettings;
  }
}
