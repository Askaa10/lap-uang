import { Test, TestingModule } from '@nestjs/testing';
import { StudentPaymentService } from './student-payment.service';

describe('StudentPaymentService', () => {
  let service: StudentPaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentPaymentService],
    }).compile();

    service = module.get<StudentPaymentService>(StudentPaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
