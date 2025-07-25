import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateStudentPaymentBulkDto,
  CreateStudentPaymentDto,
  UpdateStudentPaymentDto,
} from './student-payment.dto';
import { BaseResponse } from 'src/utils/response/base.response';

@Injectable()
export class StudentPaymentService extends BaseResponse {
  constructor(private prisma: PrismaService) {
    super();
  }

  async create(data: CreateStudentPaymentDto) {
    try {
      const sp = await this.prisma.studentPayment.create({ data });
      return this._success({
        message: {
          id: 'Student Payments berhasil ditambahkan',
          en: 'Student Payments created successfully',
        },
        data: sp,
        auth: null,
        links: {
          self: '/school/create-school',
        },
        statusCode: 201,
        statusText: 'Created',
      });
    } catch (error) {
      if (error) {
        throw new HttpException('Internal Server Error', 500);
      }
    }
  }

  async findAll() {
    const sp = await this.prisma.studentPayment.findMany({
      include: { student: true, feeItem: true },
    });

    return this._success({
      message: {
        id: 'Student Payments berhasil didapatkan',
        en: 'Student Payments retrieved successfully',
      },
      data: sp,
      auth: null,
      links: {
        self: '/school/create-school',
      },
    });
  }

  async findOne(id: string) {
    const sp = await this.prisma.studentPayment.findUnique({
      where: { id },
      include: { student: true, feeItem: true },
    });

    return this._success({
      message: {
        id: 'Student Payments berhasil didapatkan',
        en: 'Student Payments retrieved successfully',
      },
      data: sp,
      auth: null,
      links: {
        self: '/school/create-school',
      },
    });
  }

  async update(id: string, data: UpdateStudentPaymentDto) {
    try {
      const sp = await this.prisma.studentPayment.update({
        where: { id },
        data,
      });
      return this._success({
        message: {
          id: 'Student Payments berhasil diperbarui',
          en: 'Student Payments updated successfully',
        },
        data: sp,
        auth: null,
        links: {
          self: '/school/create-school',
        },
        statusCode: 201,
        statusText: 'Updated',
      });
    } catch (error) {
      if (error) {
        throw new HttpException('Internal Server error', 500);
      }
    }
  }

  async remove(id: string) {
    const sp = await this.prisma.studentPayment.delete({ where: { id } });

    return this._success({
      message: {
        id: 'Student Payments berhasil dihapus',
        en: 'Student Payments deleted successfully',
      },
      data: sp,
      auth: null,
      links: {
        self: '/school/create-school',
      },
      statusCode: 200,
      statusText: 'Deleted',
    });
  }

  async createMany(data: CreateStudentPaymentBulkDto[]) {
    const payments = [];

    for (const item of data) {
      const feeItem = await this.prisma.schoolFeeItem.findFirst({
        where: { name: item.feeItemName },
      });

      if (!feeItem) {
        throw new NotFoundException(
          `FeeItem with name ${item.feeItemName} not found`,
        );
      }

      payments.push({
        studentId: item.studentId,
        feeItemId: feeItem.id,
        amountPaid: item.amountPaid,
        paymentDate: new Date(item.paymentDate),
        transactionNo: item.transactionNo,
      });
    }
    await this.prisma.studentPayment.createMany({
      data: payments,
    });
    return this._success({
      message: {
        id: 'Student Payments berhasil ditambahkan',
        en: 'Student Payments created successfully',
      },
      data: data,
      auth: null,
      links: {
        self: '/school/create-school',
      },
      statusCode: 201,
      statusText: 'Created',
      others: {
        count: data.length,
      },
    });
  }
}
