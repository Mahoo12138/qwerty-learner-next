import { HomeModule } from '@/api/system/home/home.module';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { SettingModule } from './setting/setting.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, HealthModule, AuthModule, HomeModule, SettingModule],
})
export class SystemModule {}
