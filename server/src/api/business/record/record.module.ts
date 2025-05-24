import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChapterRecordEntity } from './entities/chapter-record.entity';
import { WordRecordEntity } from './entities/word-record.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WordRecordEntity,
      ChapterRecordEntity,
    ]),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class RecordModule {}
