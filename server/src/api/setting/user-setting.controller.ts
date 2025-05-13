import { SettingService } from '@/api/setting/setting.service';
import { Uuid } from '@/common/types/common.type';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { ApiAuth } from '@/decorators/http.decorators';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpsertSettingReqDto } from './dto/upsert-setting.req.dto';

@ApiTags('user-setting')
@Controller({
  path: 'user/setting',
  version: '1',
})
export class UserSettingController {
  constructor(private readonly settingService: SettingService) {}

  @Get()
  @ApiAuth({
    summary: 'Get all user settings',
    isPaginated: true,
  })
  async findAll(@CurrentUser('id') userId: Uuid) {
    return this.settingService.findAllUserSettings(userId);
  }

  @Post()
  @ApiAuth({
    type: UpsertSettingReqDto,
    summary: 'Create or update user setting',
  })
  async upsert(
    @Body() reqDto: UpsertSettingReqDto,
    @CurrentUser('id') userId: Uuid,
  ) {
    return this.settingService.upsertUserSetting(reqDto, userId);
  }
}
