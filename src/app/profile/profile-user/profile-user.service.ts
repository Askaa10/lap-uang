import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {  UserProfile } from './profile-user.entity';
import { UpdateUserProfileDto } from './profile-user.dto';

@Injectable()
export class ProfileUserService {
  constructor(
    @InjectRepository(UserProfile)
    private readonly userRepo: Repository<UserProfile>,
  ) {}

  async getUserProfile(id: number) {
    return await this.userRepo.findOne({ where: { id } });
  }

  async updateUserProfile(id: number, dto: UpdateUserProfileDto) {
    await this.userRepo.update(id, dto);
    return this.getUserProfile(id);
  }

  async updateUserAvatar(id: number, avatar: string) {
    await this.userRepo.update(id, { avatar });
    return this.getUserProfile(id);
  }

  async changePassword(id: number, password: string) {
    await this.userRepo.update(id, { password });
    return { message: 'Password updated successfully' };
  }
}

