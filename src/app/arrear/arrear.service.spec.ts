import { Test, TestingModule } from '@nestjs/testing';
import { ArrearsService } from './arrear.service';

describe('ArrearService', () => {
  let service: ArrearsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArrearsService],
    }).compile();

    service = module.get<ArrearsService>(ArrearsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
