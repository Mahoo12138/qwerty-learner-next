import { Test, TestingModule } from '@nestjs/testing';
import { SettingService } from './setting.service';

describe('PostService', () => {
  let service: SettingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SettingService],
    }).compile();

    service = module.get<SettingService>(SettingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
