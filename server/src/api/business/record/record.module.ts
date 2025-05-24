import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChapterRecordEntity } from './entities/chapter-record.entity';
import { ReviewRecordEntity } from './entities/review-record.entity';
import { RevisionDictRecordEntity } from './entities/revision-dict-record.entity';
import { RevisionWordRecordEntity } from './entities/revision-word-record.entity';
import { WordRecordEntity } from './entities/word-record.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WordRecordEntity,
      ChapterRecordEntity,
      ReviewRecordEntity,
      RevisionDictRecordEntity,
      RevisionWordRecordEntity,
    ]),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class RecordModule {}
