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

    return {
      message: 'School profile created successfully',
      data: created,
    };
  }

  async findAll() {
    const profiles = await this.schoolProfileRepo.find();

    return {
      message: 'List of school profiles',
      total: profiles.length,
      data: profiles,
    };
  }

  async findOne(id: string) {
    const profile = await this.schoolProfileRepo.findOne({ where: { id } });

    if (!profile) {
      return {
        message: 'School profile not found',
        data: null,
      };
    }

    return {
      message: 'School profile retrieved successfully',
      data: profile,
    };
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

    return {
      message: 'School profile updated successfully',
      data: updated,
    };
  }

  async remove(id: string) {
    const profile = await this.schoolProfileRepo.findOne({ where: { id } });

    if (!profile) {
      throw new NotFoundException('School profile not found');
    }

    await this.schoolProfileRepo.remove(profile);

    return {
      message: 'School profile deleted successfully',
      data: profile,
    };
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
      return {
        message: 'Profile not found',
        data: null,
      };
    }

    return {
      message: 'My school profile fetched successfully',
      data: profile,
    };
  }
}