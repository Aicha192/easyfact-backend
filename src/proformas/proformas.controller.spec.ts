jest.mock('./proformas.service', () => ({
  ProformasService: class ProformasService {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { ProformasService } from './proformas.service';
import { ProformasController } from './proformas.controller';

describe('ProformasController', () => {
  let controller: ProformasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProformasController],
      providers: [ProformasService],
    }).compile();

    controller = module.get<ProformasController>(ProformasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});