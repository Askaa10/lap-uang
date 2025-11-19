import { Test, TestingModule } from '@nestjs/testing';
import { ProfileAdminService } from './profile-admin.service';

describe('ProfileAdminService', () => {
  let service: ProfileAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfileAdminService],
    }).compile();

    service = module.get<ProfileAdminService>(ProfileAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
