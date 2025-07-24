import { Test, TestingModule } from '@nestjs/testing';
import { FeeGroupService } from './fee-group.service';

describe('FeeGroupService', () => {
  let service: FeeGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FeeGroupService],
    }).compile();

    service = module.get<FeeGroupService>(FeeGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
