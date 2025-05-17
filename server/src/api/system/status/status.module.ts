import { SettingModule } from '@/api/system/setting/setting.module';
import { UserModule } from '@/api/system/user/user.module';
import { Module } from '@nestjs/common';
import { StatusController } from './status.controller';

@Module({
  imports: [SettingModule, UserModule],
  controllers: [StatusController],
})
export class StatusModule {}
