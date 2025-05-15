import { DictionaryModule } from '@/api/business/dictionary/dictionary.module';
import { WordModule } from '@/api/business/word/word.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [DictionaryModule, WordModule],
})
export class BusinessModule {}
