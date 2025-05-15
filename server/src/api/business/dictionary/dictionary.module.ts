import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DictionaryController } from './dictionary.controller';
import { DictionaryService } from './dictionary.service';
import { DictionaryEntity } from './entities/dictionary.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DictionaryEntity])],
  controllers: [DictionaryController],
  providers: [DictionaryService],
  exports: [DictionaryService],
})
export class DictionaryModule {}
