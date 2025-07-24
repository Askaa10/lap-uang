import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentPaymentDto, UpdateStudentPaymentDto } from './student-payment.dto';

@Injectable()
export class StudentPaymentService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateStudentPaymentDto) {
    return await this.prisma.studentPayment.create({ data });
  }

  async findAll() {
    return await this.prisma.studentPayment.findMany({ include: { student: true, feeItem: true } });
  }

  async findOne(id: string) {
    return await this.prisma.studentPayment.findUnique({ where: { id }, include: { student: true, feeItem: true } });
  }

  async update(id: string, data: UpdateStudentPaymentDto) {
    return await this.prisma.studentPayment.update({ where: { id }, data });
  }

  async remove(id: string) {
    return await this.prisma.studentPayment.delete({ where: { id } });
  }
}
