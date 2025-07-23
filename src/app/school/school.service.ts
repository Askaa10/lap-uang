import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSchoolDto } from './school.dto';

@Injectable()
export class SchoolService {
  constructor(private Ps: PrismaService) {}

  async allSchool() {
    return this.Ps.school.findMany();
  }

  async createDataSchool(data: CreateSchoolDto) {
    const createdSchool = await this.Ps.school.create({
      data: {
        schoolName: data.schoolName,
        nip: data.nip,
        yayasan: data.yayasan,
        address: data.address,
        email: data.email,
        phone: data.phone,
        TA: data.TA,
        HeadSecretariat: data.HeadSecretariat,
        HeadSchool: data.HeadSchool,
        logoUrl: data.logoUrl,
      }
    });
    return createdSchool;
  }


  async updateDataSchool(id: string, data: CreateSchoolDto) {
    const updatedSchool = await this.Ps.school.update({
      where: {
        id: id,
      },
      data: {
        schoolName: data.schoolName,
        nip: data.nip,
        yayasan: data.yayasan,
        address: data.address,
        email: data.email,
        phone: data.phone,
        TA: data.TA,
        HeadSecretariat: data.HeadSecretariat,
        HeadSchool: data.HeadSchool,
        logoUrl: data.logoUrl,
      }
    });
    return updatedSchool;
  }


  async deleteDataSchool(id: string) {
    const deletedSchool = await this.Ps.school.delete({
      where: {
        id: id,
      }
    });
    return deletedSchool;
  }
}
