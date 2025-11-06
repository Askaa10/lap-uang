import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SppPayment } from '../spp-payment/spp-payment.entity';
import { Student } from '../student/student.entity';
import { PaymentType } from '../payment/payment-type/payment-type.entity';
import { Arrears } from './arrear.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ArrearsService {
  private readonly logger = new Logger(ArrearsService.name);

  constructor(
    @InjectRepository(Arrears)
    private readonly arrearsRepository: Repository<Arrears>,

    @InjectRepository(SppPayment)
    private readonly sppPaymentRepository: Repository<SppPayment>,

    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,

    @InjectRepository(PaymentType)
    private readonly paymentTypeRepository: Repository<PaymentType>,
  ) {}

  // 🔹 Generate tunggakan dari spp_payments yang belum lunas
  async createMonthlyArrearsForAllStudents(): Promise<string> {
    const unpaidPayments = await this.sppPaymentRepository.find({
      where: { status: 'BELUM_LUNAS' },
      relations: ['student'],
    });

    if (unpaidPayments.length === 0) {
      this.logger.log('Tidak ada pembayaran tertunggak');
      return 'Tidak ada tunggakan ditemukan.';
    }

    for (const payment of unpaidPayments) {
      const existing = await this.arrearsRepository.findOne({
        where: {
          studentId: payment.studentId,
          month: this.getMonthNumber(payment.month),
          TA: payment.year,
        },
      });

      if (!existing) {
        const arrear = this.arrearsRepository.create({
          studentId: payment.studentId,
          typeId: null, // kalau belum ada, bisa diisi manual
          status: 'BELUM_LUNAS',
          amount: payment.nominal,
          dueDate: new Date(`${payment.year}-${this.getMonthNumber(payment.month)}-10`),
          month: this.getMonthNumber(payment.month),
          semester: this.getSemester(payment.month),
          TA: payment.year,
          monthsInArrears: 1,
        });

        await this.arrearsRepository.save(arrear);
        this.logger.log(
          `Tunggakan dibuat untuk ${payment.studentId} bulan ${payment.month}`,
        );
      }
    }

    return 'Tunggakan berhasil diperbarui.';
  }

  // 🔹 Ambil daftar tunggakan semua siswa
  async getAllArrears(): Promise<Arrears[]> {
    return this.arrearsRepository.find({
      relations: ['student', 'type'],
      order: { createdAt: 'DESC' },
    });
  }

  // 🔹 Ambil tunggakan per siswa
  async getArrearsByStudent(studentId: string): Promise<Arrears[]> {
    return this.arrearsRepository.find({
      where: { studentId },
      relations: ['student', 'type'],
    });
  }

  // 🔹 Helper untuk ubah nama bulan → angka
  private getMonthNumber(monthName: string): number {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
    ];
    return months.indexOf(monthName) + 1;
  }

  // 🔹 Helper untuk semester (1 = ganjil, 2 = genap)
  private getSemester(monthName: string): number {
    const month = this.getMonthNumber(monthName);
    return month >= 1 && month <= 6 ? 2 : 1;
  }


  // // ✅ CRON jalan tiap tanggal 1 jam 00:00
  // @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)// 
  // ✅ CRON jalan tiap setiap 1 menit
  @Cron(CronExpression.EVERY_MINUTE)
  async generateMonthlyArrears() {
    const now = new Date();
    const month = now.getMonth() + 1; // Januari = 1
    const year = now.getFullYear();

    this.logger.log(`[CRON] Generate arrears ${month}/${year}`);

    // ambil semua siswa aktif
    const students = await this.studentRepository.find({
      where: { isDelete: false },
    });

    if (students.length === 0) {
      this.logger.warn('[CRON] ❌ Tidak ada siswa ditemukan');
      return;
    }

    // ambil semua tipe pembayaran aktif
    const paymentTypes = await this.paymentTypeRepository.find({
      where: { status: 'ACTIVE' },
    });

    if (paymentTypes.length === 0) {
      this.logger.warn('[CRON] ❌ Tidak ada tipe pembayaran aktif');
      return;
    }

    let createdCount = 0;

    for (const student of students) {
      for (const type of paymentTypes) {
        // cek apakah sudah ada tunggakan untuk bulan dan tahun ini
        const existing = await this.arrearsRepository.findOne({
          where: {
            studentId: student.id,
            typeId: type.id,
            month,
            TA: `${year}`,
          },
        });

        if (!existing) {
          const newArrear = this.arrearsRepository.create({
            studentId: student.id,
            typeId: type.id,
            status: 'BELUM_LUNAS',
            amount: Number(type.nominal || 0),
            dueDate: new Date(year, month - 1, 10), // jatuh tempo tanggal 10
            month,
            semester: month <= 6 ? 1 : 2,
            TA: `${year}`,
          });

          await this.arrearsRepository.save(newArrear);
          createdCount++;
        }
      }
    }

    this.logger.log(`[CRON] ✅ Created ${createdCount} arrears`);
  }
}

