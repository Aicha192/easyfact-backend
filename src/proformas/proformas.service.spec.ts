import { Test, TestingModule } from '@nestjs/testing';
import { ProformasService } from './proformas.service';

describe('ProformasService', () => {
  let service: ProformasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProformasService],
    }).compile();

    service = module.get<ProformasService>(ProformasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
