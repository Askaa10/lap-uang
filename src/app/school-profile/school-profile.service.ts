import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SchoolProfile } from './school-profile.entity';
import { CreateSchoolProfileDto, UpdateSchoolProfileDto } from './school-profile.dto';

@Injectable()
export class SchoolProfileService {
  constructor(
    @InjectRepository(SchoolProfile)
    private readonly schoolProfileRepo: Repository<SchoolProfile>,
  ) {}

  private _success<T>(message: string, data: T) {
    return {
      message,
      data,
    };
  }

  async create(dto: CreateSchoolProfileDto) {
    const profile = this.schoolProfileRepo.create({
      name: dto.name,
      foundation: dto.foundation,
      address: dto.address ?? null,
      phone: dto.phone ?? null,
      headmaster: dto.headmaster ?? null,
      academicYear: dto.academicYear ?? null,
    });

    const created = await this.schoolProfileRepo.save(profile);

    return this._success('School profile created successfully', created);
  }

  async findAll() {
    const profiles = await this.schoolProfileRepo.find();

    return this._success('List of school profiles', profiles);
  }

  async findOne(id: string) {
    const profile = await this.schoolProfileRepo.findOne({ where: { id } });

    if (!profile) {
      return this._success('School profile not found', null);
    }

    return this._success('School profile retrieved successfully', profile);
  }

  async update(id: string, dto: UpdateSchoolProfileDto) {
    const profile = await this.schoolProfileRepo.preload({
      id,
      ...dto,
    });

    if (!profile) {
      throw new NotFoundException('School profile not found');
    }

    const updated = await this.schoolProfileRepo.save(profile);

    return this._success('School profile updated successfully', updated);
  }

  async remove(id: string) {
    const profile = await this.schoolProfileRepo.findOne({ where: { id } });

    if (!profile) {
      throw new NotFoundException('School profile not found');
    }

    await this.schoolProfileRepo.remove(profile);

    return this._success('School profile deleted successfully', profile);
  }

  async myProfile(id: string) {
    const profile = await this.schoolProfileRepo.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        foundation: true,
        address: true,
        phone: true,
        headmaster: true,
        academicYear: true,
      },
    });

    if (!profile) {
      return this._success('Profile not found', null);
    }

    return this._success('My school profile fetched successfully', profile);
  }
}
