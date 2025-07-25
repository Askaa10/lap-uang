import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateSchoolFeeItemDto,
  UpdateSchoolFeeItemDto,
} from './school-fee.dto';
import { BaseResponse } from 'src/utils/response/base.response';

@Injectable()
export class SchoolFeeService extends BaseResponse {
  constructor(private prisma: PrismaService) {
    super();
  }

  async create(data: CreateSchoolFeeItemDto) {
    try {
      const created = await this.prisma.schoolFeeItem.create({ data });

      return this._success({
        message: {
          id: 'Item berhasil ditambahkan',
          en: 'Item created successfully',
        },
        data: created,
        auth: null,
        links: {
          self: '/school-fee/create',
        },
        statusCode: 201,
        statusText: 'Created',
      });
    } catch (error) {
      throw new HttpException('Internal Server Error', 500);
    }
  }

  async findAll() {
    const items = await this.prisma.schoolFeeItem.findMany({
      include: { payments: true, feeGroup: true },
    });

    return this._success({
      message: {
        id: 'Data ditemukan',
        en: 'Data retrieved',
      },
      data: items,
      auth: null,
      links: {
        self: '/school-fee/find-all',
      },
      statusCode: 200,
      statusText: 'OK',
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.schoolFeeItem.findUnique({
      where: { id },
      include: { payments: true },
    });

    return this._success({
      message: {
        id: 'Item ditemukan',
        en: 'Item found',
      },
      data: item,
      auth: null,
      links: {
        self: `/school-fee/${id}`,
      },
      statusCode: 200,
      statusText: 'OK',
    });
  }

  async update(id: string, data: UpdateSchoolFeeItemDto) {
    try {
      const updated = await this.prisma.schoolFeeItem.update({
        where: { id },
        data,
      });

      return this._success({
        message: {
          id: 'Item berhasil diperbarui',
          en: 'Item updated successfully',
        },
        data: updated,
        auth: null,
        links: {
          self: `/school-fee/update/${id}`,
        },
        statusCode: 200,
        statusText: 'Updated',
      });
    } catch (error) {
      throw new HttpException('Internal Server Error', 500);
    }
  }

  async remove(id: string) {
    try {
      const deleted = await this.prisma.schoolFeeItem.delete({
        where: { id },
      });

      return this._success({
        message: {
          id: 'Item berhasil dihapus',
          en: 'Item deleted successfully',
        },
        data: deleted,
        auth: null,
        links: {
          self: `/school-fee/delete/${id}`,
        },
        statusCode: 200,
        statusText: 'Deleted',
      });
    } catch (error) {
      throw new HttpException('Internal Server Error', 500);
    }
  }

  async createBulkFe(payload: CreateSchoolFeeItemDto[]) {
    try {
      const items = await this.prisma.schoolFeeItem.createMany({
        data: payload,
      });

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
    } catch (error) {
      throw new HttpException('Internal Server Error', 500);
    }
  }
}
