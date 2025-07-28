import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseResponse } from 'src/utils/response/base.response';
import { CreateSppPaymentDto, ReportQueryDto } from './report-query.dto';

@Injectable()
export class ReportService extends BaseResponse {
  constructor(private Ps: PrismaService) {
    super();
  }

  async getSppReport(query: ReportQueryDto) {
    const students = await this.Ps.student.findMany({
      where: {
        ...(query.kelas && { class: parseInt(query.kelas.replace('A', '')) }),
      },
      include: {
        payments: {
          where: {
            feeItem: {
              name: 'SPP',
            },
          },
          include: {
            feeItem: true,
          },
        },
      },
    });

    const result = students.map((student) => {
      const bulanBayar: Record<string, number> = {};
      let totalBayar = 0;

      for (const payment of student.payments) {
        const bulan = payment.paymentDate.getMonth(); // 0 = Jan
        const bulanNama = this.bulanKeNama(bulan);
        bulanBayar[bulanNama] = Number(payment.amountPaid);
        totalBayar += Number(payment.amountPaid);
      }

      return {
        asrama: `A${student.class}`,
        NoInduk: student.NoInduk,
        nama: student.name,
        status: totalBayar >= 600000 ? 'Lunas' : 'Belum Lunas',
        tagihan: 600000,
        sudahBayar: bulanBayar,
        totalDibayar: totalBayar,
        sisaKekurangan: 600000 - totalBayar,
      };
    });

    return result;
  }

  bulanKeNama(index: number): string {
    const bulan = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ];
    return bulan[index] || '-';
  }

  async getOtherPayments() {
    const students = await this.Ps.student.findMany({
      include: {
        payments: {
          include: {
            feeItem: true,
          },
        },
      },
    });

    const result = students.map((s) => {
      const paymentMap = new Map<string, number>();

      s.payments.forEach((p) => {
        const key = p.feeItem.name;
        const prev = paymentMap.get(key) || 0;
        paymentMap.set(key, prev + Number(p.amountPaid));
      });

      const total = [...paymentMap.values()].reduce((a, b) => a + b, 0);

      return {
        kelas: `A${s.class}`,
        noInduk: s.NoInduk,
        nama: s.name,
        uangMasuk: paymentMap.get('Uang Masuk') || 0,
        daftarUlang: paymentMap.get('Daftar Ulang') || 0,
        muharrom: paymentMap.get('Muharrom') || 0,
        hsn: paymentMap.get('HSN') || 0,
        haol: paymentMap.get('Haol') || 0,
        maulid: paymentMap.get('Maulid') || 0,
        rajab: paymentMap.get('Rajab') || 0,
        ulangan: paymentMap.get('Ulangan') || 0,
        akhirussanah: paymentMap.get('Akhirussanah') || 0,
        jumlah: total,
      };
    });

    return result;
  }

  async getTunggakanReport() {
    const students = await this.Ps.student.findMany({
      include: {
        payments: {
          include: {
            feeItem: true,
          },
        },
      },
    });

    // Anggap tagihan total per siswa: 600_000 (bisa diubah jadi dinamis jika perlu)
    const TAGIHAN_TOTAL = 600_000;

    return students.map((s) => {
      const totalBayar = s.payments
        .filter((p) => p.feeItem.name === 'SPP')
        .reduce((sum, p) => sum + Number(p.amountPaid), 0);

      const sisaTunggakan = TAGIHAN_TOTAL - totalBayar;

      // Build paymentMap for other payment types
      const paymentMap = new Map<string, number>();
      s.payments.forEach((p) => {
        const key = p.feeItem.name;
        const prev = paymentMap.get(key) || 0;
        paymentMap.set(key, prev + Number(p.amountPaid));
      });

      const total = [...paymentMap.values()].reduce((a, b) => a + b, 0);

      return this._success({
        message: {
          id: 'report.tunggakan.success',
          en: 'Tunggakan report retrieved successfully',
        },
        auth: null,
        data: {
          kelas: `A${s.class}`,
          noInduk: s.NoInduk,
          nama: s.name,
          uangMasuk: paymentMap.get('Uang Masuk') || 0,
          daftarUlang: paymentMap.get('Daftar Ulang') || 0,
          muharrom: paymentMap.get('Muharrom') || 0,
          hsn: paymentMap.get('HSN') || 0,
          haol: paymentMap.get('Haol') || 0,
          maulid: paymentMap.get('Maulid') || 0,
          rajab: paymentMap.get('Rajab') || 0,
          ulangan: paymentMap.get('Ulangan') || 0,
          akhirussanah: paymentMap.get('Akhirussanah') || 0,
          jumlah: total,
        },
        links:{
          self: `/report/tunggakan/${s.NoInduk}`,
          student: `/students/${s.NoInduk}`
        }
      });
    });
  }
}
