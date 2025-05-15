import { BusinessModule } from '@/api/business/business.module';
import { SystemModule } from '@/api/system/system.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [SystemModule, BusinessModule],
})
export class ApiModule {}
