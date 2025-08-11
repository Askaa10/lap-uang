import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Arrear } from './arrear.entity';
import { CreateArrearDto, UpdateArrearDto } from './arrear.dto';

@Injectable()
export class ArrearService {
  constructor(
    @InjectRepository(Arrear)
    private readonly arrearRepo: Repository<Arrear>,
  ) {}

  async create(dto: CreateArrearDto) {
    const arrear = this.arrearRepo.create(dto);
    const saved = await this.arrearRepo.save(arrear);
    return {
      message: 'Arrear created successfully',
      data: saved,
    };
  }

  async findAll() {
    const arrears = await this.arrearRepo.find({ relations: ['student', 'type'] });
    return {
      message: 'List of arrears',
      total: arrears.length,
      data: arrears,
    };
  }

  async findOne(id: string) {
    const arrear = await this.arrearRepo.findOne({ where: { id }, relations: ['student', 'type'] });

    if (!arrear) {
      throw new NotFoundException('Arrear not found');
    }

    return {
      message: 'Arrear retrieved successfully',
      data: arrear,
    };
  }

  async update(id: string, dto: UpdateArrearDto) {
    const arrear = await this.arrearRepo.preload({ id, ...dto });

    if (!arrear) {
      throw new NotFoundException('Arrear not found');
    }

    const updated = await this.arrearRepo.save(arrear);
    return {
      message: 'Arrear updated successfully',
      data: updated,
    };
  }

  async remove(id: string) {
    const arrear = await this.arrearRepo.findOne({ where: { id } });

    if (!arrear) {
      throw new NotFoundException('Arrear not found');
    }

    await this.arrearRepo.remove(arrear);
    return {
      message: 'Arrear deleted successfully',
      data: arrear,
    };
  }
}
