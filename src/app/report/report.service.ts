import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportService {

    constructor(private readonly prisma: PrismaService) {}

    async getRekapPembayaran() {
      const students = await this.prisma.student.findMany({
        include: {
          payments: {
            include: { feeItem: true },
          },
        },
      });
  
      return students.map((student) => {
        const rincian: Record<string, number> = {};
        let jumlahPenerimaan = 0;
        let bayarTunggakan = 0;
  
        for (const p of student.payments) {
          const label = p.feeItem.name;
          const type = p.feeItem.type;
  
          rincian[label] = rincian[label] || 0;
          rincian[label] += Number(p.amountPaid);
          jumlahPenerimaan += Number(p.amountPaid);
  
          if (type === 'OTHER') {
            bayarTunggakan += Number(p.amountPaid);
          }
        }
  
        return {
          kelas: student.class,
          noInduk: student.NoInduk,
          nama: student.name,
          jumlahPenerimaan,
          rincianPembayaran: rincian,
          bayarTunggakan,
        };
      });
    }

    async getRekapTagihan() {
        const students = await this.prisma.student.findMany({
          include: {
            payments: {
              include: { feeItem: true },
            },
          },
        });
      
        const feeItems = await this.prisma.schoolFeeItem.findMany({
          where: { isActive: true },
        });
      
        return students.map((student) => {
          const rincian: Record<string, number> = {};
          const tagihan: Record<string, number> = {};
          let totalTagihan = 0;
          let totalBayar = 0;
          let bayarTunggakan = 0;
      
          // Siapkan tagihan default dari fee item yang aktif
          for (const item of feeItems) {
            const label = item.name;
            const amount = Number(item.amount || 0);
            tagihan[label] = amount;
            rincian[label] = 0;
            totalTagihan += amount;
          }
      
          // Hitung semua pembayaran
          for (const payment of student.payments) {
            const label = payment.feeItem.name;
            const amount = Number(payment.amountPaid);
      
            if (payment.feeItem.type === 'OTHER') {
              bayarTunggakan += amount;
            } else {
              rincian[label] = (rincian[label] || 0) + amount;
            }
      
            totalBayar += amount;
          }
      
          return {
            kelas: student.class,
            noInduk: student.NoInduk,
            nama: student.name,
            tagihanSetahun: totalTagihan,
            rincianSudahDibayar: rincian,
            totalSudahBayar: totalBayar,
            totalKurangBayar: Math.max(0, totalTagihan - totalBayar),
            tunggakan: bayarTunggakan,
          };
        });
      }


      async getRekapKekurangan() {
        const students = await this.prisma.student.findMany({
          include: {
            payments: {
              include: { feeItem: true },
            },
          },
        });
      
        const feeItems = await this.prisma.schoolFeeItem.findMany({
          where: { isActive: true },
        });
      
        return students.map((student) => {
          const bayar: Record<string, number> = {};
          const kekurangan: Record<string, number> = {};
          const tagihan: Record<string, number> = {};
          let totalTagihan = 0;
          let totalSudahBayar = 0;
          let totalBelumBayar = 0;
          let tunggakan = 0;
      
          for (const item of feeItems) {
            const label = item.name;
            const nominal = Number(item.amount || 0);
            tagihan[label] = nominal;
            bayar[label] = 0;
            kekurangan[label] = nominal;
            totalTagihan += nominal;
          }
      
          for (const payment of student.payments) {
            const label = payment.feeItem.name;
            const jumlah = Number(payment.amountPaid);
      
            if (payment.feeItem.type === 'OTHER') {
              tunggakan += jumlah;
            } else {
              bayar[label] = (bayar[label] || 0) + jumlah;
              totalSudahBayar += jumlah;
            }
          }
      
          for (const label in tagihan) {
            kekurangan[label] = Math.max(0, tagihan[label] - bayar[label]);
            totalBelumBayar += kekurangan[label];
          }
      
          return {
            kelas: student.class,
            noInduk: student.NoInduk,
            nama: student.name,
            totalTagihan,
            totalSudahBayar,
            totalBelumBayar,
            rincianBelumDibayar: kekurangan,
            tunggakan,
          };
        });
      }
}
