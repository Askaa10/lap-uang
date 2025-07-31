import { Test, TestingModule } from '@nestjs/testing';
import { ArrearService } from './arrear.service';

describe('ArrearService', () => {
  let service: ArrearService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArrearService],
    }).compile();

    service = module.get<ArrearService>(ArrearService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
