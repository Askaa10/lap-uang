import { Test, TestingModule } from '@nestjs/testing';
import { SchoolFeeService } from './school-fee.service';

describe('SchoolFeeService', () => {
  let service: SchoolFeeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SchoolFeeService],
    }).compile();

    service = module.get<SchoolFeeService>(SchoolFeeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
