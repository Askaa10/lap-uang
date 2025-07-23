import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSchoolDto } from './school.dto';
import { BaseResponse } from 'src/utils/response/base.response';

@Injectable()
export class SchoolService extends BaseResponse {
  constructor(private Ps: PrismaService) {
    super();
  }

  async allSchool() {
    const school = await this.Ps.school.findMany();
    return this._success({
      message: {
        id: 'Berhasil mengambil semua sekolah',
        en: 'Successfully fetched all schools',
      },
      data: school,
      auth: null,
      links: {
        self: '/school/all-schools',
      },
    });
  }

  async createDataSchool(data: CreateSchoolDto) {
    try {
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
        },
      });

      return this._success({
        message: {
          id: 'Sekolah berhasil ditambahkan',
          en: 'School created successfully',
        },
        data: createdSchool,
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

  async updateDataSchool(id: string, data: CreateSchoolDto) {
    try {
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
        },
      });

      if (!updatedSchool) {
        throw new HttpException('School Not found', 404);
      }
      return this._success({
        message: {
          id: 'Sekolah berhasil diperbarui',
          en: 'School updated successfully',
        },
        data: updatedSchool,
        auth: null,
        links: {
          self: '/school/updated-data-school',
        },
        statusCode: 201,
        statusText: 'Updated',
      });
    } catch (error) {
      if (error) {
        throw new HttpException('Internal Server Error', 500);
      }
    }
  }

  async deleteDataSchool(id: string) {
    const deletedSchool = await this.Ps.school.delete({
      where: {
        id: id,
      },
    });

     if (!deletedSchool) {
       throw new HttpException('School Not found', 404);
    }
    
    return this._success({
      message: {
        id: 'Sekolah berhasil ditambahkan',
        en: 'School created successfully',
      },
      data: deletedSchool,
      auth: null,
      links: {
        self: '/school/updated-data-school',
      },
      statusCode: 201,
      statusText: 'Updated',
    });
  }
}
