import { Test, TestingModule } from '@nestjs/testing';
import { ProformasController } from './proformas.controller';

describe('ProformasController', () => {
  let controller: ProformasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProformasController],
    }).compile();

    controller = module.get<ProformasController>(ProformasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
