import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChapterRecordEntity } from './entities/chapter-record.entity';
import { WordRecordEntity } from './entities/word-record.entity';
import { RecordController } from './record.controller';
import { RecordService } from './record.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChapterRecordEntity, WordRecordEntity])],
  controllers: [RecordController],
  providers: [RecordService],
  exports: [RecordService],
})
export class RecordModule {}
