import { DictionaryModule } from '@/api/business/dictionary/dictionary.module';
import { WordModule } from '@/api/business/word/word.module';
import { Module } from '@nestjs/common';
import { RecordModule } from './record/record.module';

@Module({
  imports: [DictionaryModule, WordModule, RecordModule],
})
export class BusinessModule {}
