import { Test, TestingModule } from '@nestjs/testing';
import { ArrearsController } from './arrear.controller';

describe('ArrearController', () => {
  let controller: ArrearsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArrearsController],
    }).compile();

    controller = module.get<ArrearsController>(ArrearsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
