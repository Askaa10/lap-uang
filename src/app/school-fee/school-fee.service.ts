import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSchoolFeeItemDto, UpdateSchoolFeeItemDto } from './school-fee.dto';
import { BaseResponse } from 'src/utils/response/base.response';


@Injectable()
export class SchoolFeeService extends BaseResponse{
  constructor(private prisma: PrismaService) {
    super ();
  }

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

  async createBulkFe(payload : CreateSchoolFeeItemDto[]) {
    const items = await this.prisma.schoolFeeItem.createMany({ data: payload });

    return this._success({
      message: {
        id: 'Item berhasil ditambahkan',
        en: 'Item created successfully',
      },
      data: items,
      auth: null,
      links: {
        self: '/school-fee/tambah-item',
      },
      statusCode: 201,
      statusText: 'Created',
    });
  }
}