import { Test, TestingModule } from '@nestjs/testing';
import { StudentPaymentController } from './student-payment.controller';

describe('StudentPaymentController', () => {
  let controller: StudentPaymentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentPaymentController],
    }).compile();

    controller = module.get<StudentPaymentController>(StudentPaymentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
