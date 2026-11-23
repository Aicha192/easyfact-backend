jest.mock('./factures.service', () => ({
  FacturesService: class FacturesService {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { FacturesService } from './factures.service';
import { FacturesController } from './factures.controller';

describe('FacturesController', () => {
  let controller: FacturesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FacturesController],
      providers: [FacturesService],
    }).compile();

    controller = module.get<FacturesController>(FacturesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});