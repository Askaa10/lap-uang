import { Test, TestingModule } from '@nestjs/testing';
import { ProfileUserController } from './profile-user.controller';

describe('ProfileUserController', () => {
  let controller: ProfileUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileUserController],
    }).compile();

    controller = module.get<ProfileUserController>(ProfileUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
