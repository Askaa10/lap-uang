import { Test, TestingModule } from '@nestjs/testing';
import { SppPaymentService } from './spp-payment.service';

describe('SppPaymentService', () => {
  let service: SppPaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SppPaymentService],
    }).compile();

    service = module.get<SppPaymentService>(SppPaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
