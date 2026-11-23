jest.mock('./parametres.service', () => ({
  ParametresService: class ParametresService {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { ParametresService } from './parametres.service';
import { ParametresController } from './parametres.controller';

describe('ParametresController', () => {
  let controller: ParametresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParametresController],
      providers: [ParametresService],
    }).compile();

    controller = module.get<ParametresController>(ParametresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});