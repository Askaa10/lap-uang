import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MasterDataService {
     constructor(private prisma: PrismaService) {}

  async getMasterData() {
    const feeItems = await this.prisma.schoolFeeItem.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });

    const payments = await this.prisma.studentPayment.findMany({
      include: {
        student: true,
        feeItem: true,
      },
      orderBy: { paymentDate: 'asc' },
    });

    const byStudent: Record<string, any> = {};

    for (const p of payments) {
      if (!byStudent[p.studentId]) {
        byStudent[p.studentId] = {
          tanggalBayar: p.paymentDate, // bisa disesuaikan (misal terakhir)
          noTransaksi: p.transactionNo,
          noInduk: p.student.NoInduk,
          namaSiswa: p.student.name,
          payments: {},
        };
      }
      const current = byStudent[p.studentId];
      // simpan paymentDate & transactionNo terakhir jika lebih baru
      if (p.paymentDate > current.tanggalBayar) {
        current.tanggalBayar = p.paymentDate;
        current.noTransaksi = p.transactionNo;
      }
      current.payments[p.feeItem.name] = p.amountPaid;
    }

    const rows = Object.values(byStudent).map((row: any) => {
      const result: any = {
        tanggalBayar: row.tanggalBayar,
        noTransaksi: row.noTransaksi,
        noInduk: row.noInduk,
        namaSiswa: row.namaSiswa,
      };
      for (const item of feeItems) {
        result[item.name] = row.payments[item.name] ?? null;
      }
      return result;
    });

    return {
      columns: [
        'tanggalBayar',
        'noTransaksi',
        'noInduk',
        'namaSiswa',
        ...feeItems.map((i) => i.name),
      ],
      data: rows,
    };
  }
}
