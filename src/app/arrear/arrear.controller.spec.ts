import { Test, TestingModule } from '@nestjs/testing';
import { ArrearController } from './arrear.controller';

describe('ArrearController', () => {
  let controller: ArrearController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArrearController],
    }).compile();

    controller = module.get<ArrearController>(ArrearController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
