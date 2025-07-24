import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFeeGroupDto, UpdateFeeGroupDto } from './fee-group.dto';

@Injectable()
export class FeeGroupService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateFeeGroupDto) {
    return await this.prisma.feeGroup.create({ data });
  }

  async findAll() {
    return await this.prisma.feeGroup.findMany({
      include: { items: true },
    });
  }

  async findOne(id: string) {
    return await this.prisma.feeGroup.findUnique({
      where: { id },
      include: { items: true },
    });
  }

  async update(id: string, data: UpdateFeeGroupDto) {
    return await this.prisma.feeGroup.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return await this.prisma.feeGroup.delete({
      where: { id },
    });
  }
}
