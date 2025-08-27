import { Test, TestingModule } from '@nestjs/testing';
import { InitialBalanceController } from './initial-balance.controller';

describe('InitialBalanceController', () => {
  let controller: InitialBalanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InitialBalanceController],
    }).compile();

    controller = module.get<InitialBalanceController>(InitialBalanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
