import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseResponse } from 'src/utils/response/base.response';

@Injectable()
export class StudentService extends BaseResponse {
  constructor(private readonly Ps: PrismaService) {
    super();
  }

  async getAll() {
    const students = await this.Ps.student.findMany();
    return this._success({ data: students });
  }
}
