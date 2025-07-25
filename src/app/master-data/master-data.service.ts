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


   async getPaymentTable() {
    // Ambil fee item aktif
    const feeItems = await this.Ps.schoolFeeItem.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });

    // Ambil semua student payment dengan relasi
    const payments = await this.Ps.studentPayment.findMany({
      include: {
        student: {
          include: { school: true }
        },
        feeItem: true
      },
      orderBy: {
        paymentDate: 'asc'
      }
    });

    // Group by student
    const grouped: Record<string, any> = {};

    for (const p of payments) {
      const sid = p.studentId;
      if (!grouped[sid]) {
        grouped[sid] = {
          transactionNo: p.transactionNo,
          paymentDate: p.paymentDate.toISOString().split('T')[0],
          NoInduk: p.student.NoInduk,
          name: p.student.name,
          class: `A${p.student.class}`,
          SPP: null,
          Tahun: p.paymentDate.getFullYear(),
          Bulan: p.paymentDate.getMonth() + 1,
          // fee items: default null
          "Uang Masuk": null,
          "Daftar Ulang": null,
          "Muharrom": null,
          "HSN": null,
          "Haol": null,
          "Maulid": null,
          "Rajab": null,
          "Ulangan": null,
          "Akhirussanah": null
        };
      }

      const itemName = p.feeItem.name;

      if (itemName === "SPP") {
        grouped[sid]["SPP"] = Number(p.amountPaid);
      } else if (grouped[sid].hasOwnProperty(itemName)) {
        grouped[sid][itemName] = Number(p.amountPaid);
      }
    }

    return Object.values(grouped);
  }
}
