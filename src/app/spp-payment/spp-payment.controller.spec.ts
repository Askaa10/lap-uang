import { Test, TestingModule } from '@nestjs/testing';
import { SppPaymentController } from './spp-payment.controller';

describe('SppPaymentController', () => {
  let controller: SppPaymentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SppPaymentController],
    }).compile();

    controller = module.get<SppPaymentController>(SppPaymentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
