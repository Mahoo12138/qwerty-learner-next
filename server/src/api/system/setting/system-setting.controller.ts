import { Uuid } from '@/common/types/common.type';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { ApiAuth, ApiPublic } from '@/decorators/http.decorators'; // 导入 ApiPublic
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'; // 导入 ApiOperation 和 ApiResponse
import { UpsertSettingReqDto } from './dto/upsert-setting.req.dto';
import { SettingService } from './setting.service';

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
  async createOrUpdate(
    @Body() reqDto: UpsertSettingReqDto,
    @CurrentUser('id') userId: Uuid,
  ) {
    return this.settingService.upsertSystemSetting(reqDto, userId);
  }

  @Get('public') // 新增的公开接口路径
  @ApiPublic() // 标记为公开接口
  @ApiOperation({ summary: 'Get all public system settings' }) // Swagger 文档说明
  @ApiResponse({
    status: 200,
    description: 'Return all system settings in a flattened format.',
    // type: { [key: string]: string | undefined }, // Swagger 类型定义，根据需要调整
  })
  async findPublicSettings(): Promise<{ [key: string]: string | undefined }> {
    return this.settingService.findAllSystemSettingsForPublic();
  }
}
