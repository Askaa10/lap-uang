import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSchoolFeeItemDto, UpdateSchoolFeeItemDto } from './school-fee.dto';


@Injectable()
export class SchoolFeeService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateSchoolFeeItemDto) {
    return await this.prisma.schoolFeeItem.create({ data });
  }

  async findAll() {
    return await this.prisma.schoolFeeItem.findMany({ include: { payments: true, feeGroup: true } });
  }

  async findOne(id: string) {
    return await this.prisma.schoolFeeItem.findUnique({ where: { id }, include: { payments: true } });
  }

  async update(id: string, data: UpdateSchoolFeeItemDto) {
    return await this.prisma.schoolFeeItem.update({ where: { id }, data });
  }

  async remove(id: string) {
    return await this.prisma.schoolFeeItem.delete({ where: { id } });
  }
}