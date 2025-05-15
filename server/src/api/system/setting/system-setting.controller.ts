import { ApiAuth } from '@/decorators/http.decorators';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpsertSettingReqDto } from './dto/upsert-setting.req.dto';
import { SettingService } from './setting.service';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { Uuid } from '@/common/types/common.type';

@ApiTags('system-setting')
@Controller({
  path: 'system/setting',
  version: '1',
})
export class SystemSettingController {
  constructor(private readonly settingService: SettingService) {}

  @Get()
  @ApiAuth({
    summary: 'Get all system setting',
  })
  async findAll() {
    return this.settingService.findAllSystemSettings();
  }

  @Post()
  @ApiAuth({
    type: UpsertSettingReqDto,
    summary: 'Create or update a system setting',
  })
  async createOrUpdate(@Body() reqDto: UpsertSettingReqDto, @CurrentUser('id') userId: Uuid) {
    return this.settingService.upsertSystemSetting(reqDto, userId);
  }
}
