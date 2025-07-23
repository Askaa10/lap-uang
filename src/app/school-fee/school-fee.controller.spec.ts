import { Test, TestingModule } from '@nestjs/testing';
import { SchoolFeeController } from './school-fee.controller';

describe('SchoolFeeController', () => {
  let controller: SchoolFeeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchoolFeeController],
    }).compile();

    controller = module.get<SchoolFeeController>(SchoolFeeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
