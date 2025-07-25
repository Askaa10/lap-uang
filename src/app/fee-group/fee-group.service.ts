import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFeeGroupDto, UpdateFeeGroupDto } from './fee-group.dto';
import { BaseResponse } from 'src/utils/response/base.response';

@Injectable()
export class FeeGroupService extends BaseResponse {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(data: CreateFeeGroupDto) {
    try {
      const created = await this.prisma.feeGroup.create({ data });
      return this._success({
        message: {
          id: 'Kelompok biaya berhasil ditambahkan',
          en: 'Fee group created successfully',
        },
        data: created,
        auth: null,
        links: {
          self: '/fee-group/create',
        },
        statusCode: 201,
        statusText: 'Created',
      });
    } catch (error) {
      throw new HttpException('Internal Server Error', 500);
    }
  }

  async findAll() {
    const data = await this.prisma.feeGroup.findMany({
      include: { items: true },
    });
    return this._success({
      message: {
        id: 'Data kelompok biaya berhasil diambil',
        en: 'Fee groups fetched successfully',
      },
      data,
      auth: null,
      links: {
        self: '/fee-group',
      },
      statusCode: 200,
      statusText: 'OK',
    });
  }

  async findOne(id: string) {
    const data = await this.prisma.feeGroup.findUnique({
      where: { id },
      include: { items: true },
    });
    return this._success({
      message: {
        id: 'Detail kelompok biaya berhasil diambil',
        en: 'Fee group details fetched successfully',
      },
      data,
      auth: null,
      links: {
        self: `/fee-group/${id}`,
      },
      statusCode: 200,
      statusText: 'OK',
    });
  }

  async update(id: string, data: UpdateFeeGroupDto) {
    try {
      const updated = await this.prisma.feeGroup.update({
        where: { id },
        data,
      });
      return this._success({
        message: {
          id: 'Kelompok biaya berhasil diperbarui',
          en: 'Fee group updated successfully',
        },
        data: updated,
        auth: null,
        links: {
          self: `/fee-group/${id}/update`,
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
      const deleted = await this.prisma.feeGroup.delete({
        where: { id },
      });
      return this._success({
        message: {
          id: 'Kelompok biaya berhasil dihapus',
          en: 'Fee group deleted successfully',
        },
        data: deleted,
        auth: null,
        links: {
          self: `/fee-group/${id}/delete`,
        },
        statusCode: 200,
        statusText: 'Deleted',
      });
    } catch (error) {
      throw new HttpException('Internal Server Error', 500);
    }
  }
}
