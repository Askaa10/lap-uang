import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateSchoolProfileDto } from './profile-admin.dto';
import { SchoolProfile } from './profile-admin.entity';

@Injectable()
export class ProfileAdminService {
  constructor(
    @InjectRepository(SchoolProfile)
    private readonly schoolRepo: Repository<SchoolProfile>,
  ) {}

  async getSchoolProfile() {
    return this.schoolRepo.findOne({ where: { id: 1 } });
  }

  async updateSchoolProfile(dto: UpdateSchoolProfileDto) {
    await this.schoolRepo.update(1, dto);
    return this.getSchoolProfile();
  }

  async updateAvatar(filePath: string) {
    await this.schoolRepo.update(1, { avatar: filePath });
    return this.getSchoolProfile();
  }

  async updateBanner(filePath: string) {
    await this.schoolRepo.update(1, { banner: filePath });
    return this.getSchoolProfile();
  }
}
