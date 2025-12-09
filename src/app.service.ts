import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Expense } from './app/expense/expense.entity';
import { Repository } from 'typeorm';
import { PaymentHistory } from './app/payment/payment-history/payment-history.entity';
import { SppPayment } from './app/spp-payment/spp-payment.entity';
import { BaseResponse } from './utils/response/base.response';

@Injectable()
export class AppService extends BaseResponse {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepo: Repository<Expense>,
    @InjectRepository(PaymentHistory)
    private readonly paymentHistoryRepo: Repository<PaymentHistory>,
    @InjectRepository(SppPayment)
    private readonly sppRepo: Repository<SppPayment>,
  ) {
    super();
  }
  getHello(): string {
    return 'Hello World!';
  }

  async GetDashboard(year: string) {
    const y = Number(year);
    const lastYear = y - 1;

    // ===============================
    // Helper Persentase
    // ===============================
    const calculatePercentage = (current: number, previous: number) => {
      if (!previous || previous === 0) {
        return current > 0 ? 100 : 0;
      }
      return Number((((current - previous) / previous) * 100).toFixed(2));
    };

    // ===============================
    // 1. PEMASUKAN PAYMENT HISTORY (TAHUN INI)
    // ===============================
    const paymentHistory = await this.paymentHistoryRepo
      .createQueryBuilder('ph')
      .select('SUM(ph.paid)', 'total')
      .where('ph.year = :year', { year })
      .getRawOne();

    const pemasukanPaymentHistory = Number(paymentHistory?.total || 0);

    // ===============================
    // 1b. PEMASUKAN PAYMENT HISTORY (TAHUN LALU)
    // ===============================
    const paymentHistoryLast = await this.paymentHistoryRepo
      .createQueryBuilder('ph')
      .select('SUM(ph.paid)', 'total')
      .where('ph.year = :year', { year: lastYear })
      .getRawOne();

    const pemasukanPaymentHistoryLast = Number(paymentHistoryLast?.total || 0);

    // ===============================
    // 2. PEMASUKAN SPP (TAHUN INI)
    // ===============================
    const spp = await this.sppRepo
      .createQueryBuilder('spp')
      .select('SUM(spp.paid)', 'total')
      .where('spp.year = :year', { year })
      .getRawOne();

    const pemasukanSpp = Number(spp?.total || 0);

    // ===============================
    // 2b. PEMASUKAN SPP (TAHUN LALU)
    // ===============================
    const sppLast = await this.sppRepo
      .createQueryBuilder('spp')
      .select('SUM(spp.paid)', 'total')
      .where('spp.year = :year', { year: lastYear })
      .getRawOne();

    const pemasukanSppLast = Number(sppLast?.total || 0);

    // ===============================
    // 3. PENGELUARAN (TAHUN INI)
    // ===============================
    const pengeluaran = await this.expenseRepo
      .createQueryBuilder('ex')
      .select('SUM(ex.amount)', 'total')
      .where('YEAR(ex.PayDate) = :year', { year })
      .andWhere('ex.isDelete = false')
      .getRawOne();

    const totalPengeluaran = Number(pengeluaran?.total || 0);

    // ===============================
    // 3b. PENGELUARAN (TAHUN LALU)
    // ===============================
    const pengeluaranLast = await this.expenseRepo
      .createQueryBuilder('ex')
      .select('SUM(ex.amount)', 'total')
      .where('YEAR(ex.PayDate) = :year', { year: lastYear })
      .andWhere('ex.isDelete = false')
      .getRawOne();

    const totalPengeluaranLast = Number(pengeluaranLast?.total || 0);

    // ===============================
    // 4. TOTAL PEMASUKAN (tahun ini & tahun lalu)
    // ===============================
    const totalPendapatan = pemasukanSpp + pemasukanPaymentHistory;
    const totalPendapatanLast = pemasukanSppLast + pemasukanPaymentHistoryLast;

    // ===============================
    // 5. SALDO (tahun ini & tahun lalu)
    // ===============================
    const saldoSaatIni = totalPendapatan - totalPengeluaran;
    const saldoLast = totalPendapatanLast - totalPengeluaranLast;

    // ===============================
    // 6. HITUNG PERSENTASE
    // ===============================
    const persentase = {
      saldo: calculatePercentage(saldoSaatIni, saldoLast),
      pendapatan: calculatePercentage(totalPendapatan, totalPendapatanLast),
      pengeluaran: calculatePercentage(totalPengeluaran, totalPengeluaranLast),
      pemasukanSpp: calculatePercentage(pemasukanSpp, pemasukanSppLast),
      pemasukanSelainSpp: calculatePercentage(
        pemasukanPaymentHistory,
        pemasukanPaymentHistoryLast,
      ),
    };

    // ===============================
    // 7. STATISTIK BULANAN
    // ===============================

    const MONTHS = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'Mei',
      'Jun',
      'Jul',
      'Agu',
      'Sep',
      'Okt',
      'Nov',
      'Des',
    ];

    const SPP_MAP = {
      Januari: 'Jan',
      Februari: 'Feb',
      Maret: 'Mar',
      April: 'Apr',
      Mei: 'Mei',
      Juni: 'Jun',
      Juli: 'Jul',
      Agustus: 'Agu',
      September: 'Sep',
      Oktober: 'Okt',
      November: 'Nov',
      Desember: 'Des',
    };

    // --- PEMASUKAN PER BULAN (SPP)
    const sppBulanan = await this.sppRepo
      .createQueryBuilder('spp')
      .select('spp.month', 'month')
      .addSelect('SUM(spp.paid)', 'total')
      .where('spp.year = :year', { year })
      .groupBy('spp.month')
      .getRawMany();

    const pemasukanPerBulan: any = {};

    sppBulanan.forEach((row) => {
      const key = SPP_MAP[row.month];
      pemasukanPerBulan[key] =
        (pemasukanPerBulan[key] || 0) + Number(row.total);
    });

    // --- PEMASUKAN PER BULAN (PAYMENT HISTORY)
    const phBulanan = await this.paymentHistoryRepo
      .createQueryBuilder('ph')
      .select('ph.month', 'month')
      .addSelect('SUM(ph.paid)', 'total')
      .where('ph.year = :year', { year })
      .groupBy('ph.month')
      .getRawMany();

    phBulanan.forEach((row) => {
      const key = MONTHS[row.month - 1];
      pemasukanPerBulan[key] =
        (pemasukanPerBulan[key] || 0) + Number(row.total);
    });

    // --- PENGELUARAN PER BULAN
    const expenseBulanan = await this.expenseRepo
      .createQueryBuilder('ex')
      .select('MONTH(ex.PayDate)', 'month')
      .addSelect('SUM(ex.amount)', 'total')
      .where('YEAR(ex.PayDate) = :year', { year })
      .andWhere('ex.isDelete = false')
      .groupBy('MONTH(ex.PayDate)')
      .getRawMany();

    const pengeluaranPerBulan: any = {};
    expenseBulanan.forEach((row) => {
      const key = MONTHS[row.month - 1];
      pengeluaranPerBulan[key] = Number(row.total);
    });

    // --- GABUNG BGRAFIK
    const monthlyData: any = {};
    MONTHS.forEach((m) => {
      monthlyData[m] = [pemasukanPerBulan[m] || 0, pengeluaranPerBulan[m] || 0];
    });

    const statistik = {
      categories: ['Penerimaan', 'Pengeluaran'],
      monthlyData,
    };

    // ===============================
    // 8. RETURN
    // ===============================

    return this._success({
      data: {
        card: {
          saldo: saldoSaatIni,
          saldoPercentage: persentase.saldo,

          pendapatan: totalPendapatan,
          pendapatanPercentage: persentase.pendapatan,

          pengeluaran: totalPengeluaran,
          pengeluaranPercentage: persentase.pengeluaran,

          pemasukanSpp,
          pemasukanSppPercentage: persentase.pemasukanSpp,

          pemasukanSelainSpp: pemasukanPaymentHistory,
          pemasukanSelainSppPercentage: persentase.pemasukanSelainSpp,

          statistik,
        },
      },
    });
  }
}
