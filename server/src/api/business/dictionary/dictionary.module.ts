import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DictionaryController } from './dictionary.controller';
import { DictionaryService } from './dictionary.service';
import { DictionaryEntity } from './entities/dictionary.entity';
import { WordEntity } from '../word/entities/word.entity';
import { CategoryEntity } from '../category/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DictionaryEntity, WordEntity, CategoryEntity])],
  controllers: [DictionaryController],
  providers: [DictionaryService],
  exports: [DictionaryService],
})
export class DictionaryModule {}
