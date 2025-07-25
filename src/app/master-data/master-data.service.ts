import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseResponse } from 'src/utils/response/base.response';

@Injectable()
export class MasterDataService extends BaseResponse {
  constructor(private Ps: PrismaService) {
    super();
  }

  async getMasterData() {
    const data = await this.Ps.studentPayment.findMany({
      include: {
        student: true,
        feeItem: true,
      },
      orderBy: {
        student: {
          name: "asc"
        }
      },
    });

    return this._success({
      message: {
        id: "berhasil mendapatkan data payment",
        en: ""
      },
      auth: null,
      data: data,
      links: {
        self: "/master-data/all-list"
      }
    })
  }
}
