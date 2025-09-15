// src/arrears/arrears.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Arrears } from './arrear.entity';
  import { ArrearsDto } from './arrear.dto';
import { BaseResponse } from 'src/utils/response/base.response';


@Injectable()
export class ArrearsService extends BaseResponse {
  constructor(
    @InjectRepository(Arrears)
    private arrearsRepository: Repository<Arrears>,
  ) {
    super();
  }

  // ✅ Create single arrear
  async create(dto: ArrearsDto): Promise<Arrears> {
    const arrear = this.arrearsRepository.create(dto);
    return this.arrearsRepository.save(arrear);
  }

  // ✅ Create bulk arrears
  async createBulk(dtos: ArrearsDto[]): Promise<Arrears[]> {
    const arrears = this.arrearsRepository.create(dtos);
    return this.arrearsRepository.save(arrears);
  }

  // ✅ Find all arrears
  async findAll(): Promise<Arrears[]> {
    return this.arrearsRepository.find();
  }

  // ✅ Find arrear by ID
  async findOne(id: number): Promise<Arrears> {
    const arrear = await this.arrearsRepository.findOne({ where: { id } });
    if (!arrear) {
      throw new NotFoundException(`Arrear with ID ${id} not found`);
    }
    return arrear;
  }

  // ✅ Update arrear by ID
  async update(id: number, dto: Partial<ArrearsDto>): Promise<Arrears> {
    const arrear = await this.findOne(id);
    Object.assign(arrear, dto);
    return this.arrearsRepository.save(arrear);
  }

  // ✅ Delete arrear by ID
  async remove(id: number): Promise<{ deleted: boolean }> {
    const arrear = await this.findOne(id);
    await this.arrearsRepository.remove(arrear);
    return { deleted: true };
  }

  // ✅ Delete multiple arrears by IDs
  async removeBulk(ids: number[]): Promise<{ deleted: number }> {
    const arrears = await this.arrearsRepository.find({ where: { id: In(ids) } });
    await this.arrearsRepository.remove(arrears);
    return { deleted: arrears.length };
  }
}
