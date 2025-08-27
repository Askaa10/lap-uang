import { Test, TestingModule } from '@nestjs/testing';
import { InitialBalanceService } from './initial-balance.service';

describe('InitialBalanceService', () => {
  let service: InitialBalanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InitialBalanceService],
    }).compile();

    service = module.get<InitialBalanceService>(InitialBalanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
