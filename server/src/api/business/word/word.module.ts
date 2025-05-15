import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WordController } from './word.controller';
import { WordService } from './word.service';
import { WordEntity } from './entities/word.entity';
import { DictionaryModule } from '../dictionary/dictionary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WordEntity]),
    DictionaryModule, // 导入 DictionaryModule 以使用其服务
  ],
  controllers: [WordController],
  providers: [WordService],
  exports: [WordService],
})
export class WordModule {}
