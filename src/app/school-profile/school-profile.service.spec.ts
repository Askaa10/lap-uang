import { Test, TestingModule } from '@nestjs/testing';
import { SchoolProfileService } from './school-profile.service';

describe('SchoolProfileService', () => {
  let service: SchoolProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SchoolProfileService],
    }).compile();

    service = module.get<SchoolProfileService>(SchoolProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
