import { Module } from '@nestjs/common';
import { SettingService } from './setting.service';
import { SystemSettingController } from './system-setting.controller';
import { UserSettingController } from './user-setting.controller';

@Module({
  controllers: [SystemSettingController, UserSettingController],
  providers: [SettingService],
  exports: [SettingService],
})
export class SettingModule {}
