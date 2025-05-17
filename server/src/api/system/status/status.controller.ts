import { AllConfigType } from '@/config/config.type';
import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiPublic } from '@/decorators/http.decorators';
import { SettingService } from '../setting/setting.service';
import { UserService } from '../user/user.service';

@ApiTags('status')
@Controller({ path: 'status', version: '1' })
export class StatusController {
  constructor(
    private configService: ConfigService<AllConfigType>,
    private settingService: SettingService, // 注入 SettingService
    private userService: UserService, // 注入 UserService
  ) {}

  @ApiPublic()
  @Get()
  @ApiOperation({ summary: 'Get public system status' }) // Swagger 文档说明
  @ApiResponse({
    status: 200,
    description: 'Return public system settings and host users.',
    // 可以根据返回结构定义 type
    // type: { settings: { [key: string]: string | undefined }, hosts: UserResDto[] },
  })
  async status() {
    const settings = await this.settingService.findAllSystemSettingsForPublic();
    const host = await this.userService.findHostUser();

    return {
      settings,
      host,
    };
  }
}
