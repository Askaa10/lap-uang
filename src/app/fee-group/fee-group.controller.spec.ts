import { Test, TestingModule } from '@nestjs/testing';
import { FeeGroupController } from './fee-group.controller';

describe('FeeGroupController', () => {
  let controller: FeeGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeeGroupController],
    }).compile();

    controller = module.get<FeeGroupController>(FeeGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
