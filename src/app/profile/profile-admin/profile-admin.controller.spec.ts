import { Test, TestingModule } from '@nestjs/testing';
import { ProfileAdminController } from './profile-admin.controller';

describe('ProfileAdminController', () => {
  let controller: ProfileAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileAdminController],
    }).compile();

    controller = module.get<ProfileAdminController>(ProfileAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
