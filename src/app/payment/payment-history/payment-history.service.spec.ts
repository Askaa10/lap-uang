import { Test, TestingModule } from '@nestjs/testing';
import { PaymentHistoryService } from './payment-history.service';

describe('PaymentHistoryService', () => {
  let service: PaymentHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentHistoryService],
    }).compile();

    service = module.get<PaymentHistoryService>(PaymentHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
