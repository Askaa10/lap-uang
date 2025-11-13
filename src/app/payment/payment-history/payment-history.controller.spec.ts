import { Test, TestingModule } from '@nestjs/testing';
import { PaymentHistoryController } from './payment-history.controller';

describe('PaymentHistoryController', () => {
  let controller: PaymentHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentHistoryController],
    }).compile();

    controller = module.get<PaymentHistoryController>(PaymentHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
