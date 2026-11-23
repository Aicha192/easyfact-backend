jest.mock('./produits.service', () => ({
  ProduitsService: class ProduitsService {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { ProduitsService } from './produits.service';
import { ProduitsController } from './produits.controller';

describe('ProduitsController', () => {
  let controller: ProduitsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProduitsController],
      providers: [ProduitsService],
    }).compile();

    controller = module.get<ProduitsController>(ProduitsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});