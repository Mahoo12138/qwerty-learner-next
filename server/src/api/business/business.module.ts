import { DictionaryModule } from '@/api/business/dictionary/dictionary.module';
import { WordModule } from '@/api/business/word/word.module';
import { Module } from '@nestjs/common';
import { RecordModule } from './record/record.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [DictionaryModule, WordModule, RecordModule, CategoryModule],
})
export class BusinessModule {}
