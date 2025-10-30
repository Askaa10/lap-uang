// src/arrears/arrears.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { BaseResponse } from '../../utils/response/base.response';
import { Student } from '../student/student.entity';
import { Payment, PaymentStatus } from '../payment/payment.entity';
import { Arrears } from './arrear.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PaymentType } from '../payment/payment-type/payment-type.entity';


@Injectable()
export class ArrearsService extends BaseResponse {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,

    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,

     @InjectRepository(PaymentType)
    private readonly paymentTypeRepo: Repository<PaymentType>,

    @InjectRepository(Arrears)
    private readonly arrearRepo: Repository<Arrears>,
  ) {
    super();
  }

  // ✅ Create single arrear
  async create(dto: any) {
    const arrear = this.arrearRepo.create(dto);
    const saved = await this.arrearRepo.save(arrear);
    return this._success({
      auth: null,
      data: saved,
      errors: null,
      links: { self: '/arrears' },
      included: null,
      message: {
        id: 'Berhasil dibuat',
        en: 'Successfully created',
      },
    });
  }

  // ✅ Create bulk arrears
  async createBulk(dtos: any) {
    const arrears = this.arrearRepo.create(dtos);
    const saved = await this.arrearRepo.save(arrears);
    return this._success({
      auth: null,
      data: saved,
      errors: null,
      links: { self: '/arrears/bulk' },
      included: null,
      message: {
        id: 'Data berhasil dibuat',
        en: 'Data created successfully',
      },
    });
  }

  // ✅ Find all arrears
  async findAll() {
    const data = await this.arrearRepo.find();
console.log(data);
    return this._success({
      auth: null,
      data: data,
      errors: null,
      links: { self: '/arrears/all' },
      included: null,
      message: {
        id: 'Data berhasil diambil',
        en: 'Data fetched successfully',
      },
    });
  }

  // ✅ Find arrear by ID
  async findOne(id: string) {
    const arrear = await this.arrearRepo.findOne({ where: { id } });
    if (!arrear) throw new NotFoundException(`Arrear with ID ${id} not found`);

    return this._success({
      auth: null,
      data: arrear,
      errors: null,
      links: { self: `/arrears/detail/${id}` },
      included: null,
      message: {
        id: 'Data ditemukan',
        en: 'Data found',
      },
    });
  }

  // ✅ Update arrear by ID
  async update(id: string, dto: any) {
    const arrear = await this.arrearRepo.preload({ id, ...dto });
    if (!arrear) throw new NotFoundException(`Arrear with ID ${id} not found`);

    const updated = await this.arrearRepo.save(arrear);
    return this._success({
      auth: null,
      data: updated,
      errors: null,
      links: { self: `/arrears/update/${id}` },
      included: null,
      message: {
        id: 'Data berhasil diperbarui',
        en: 'Data updated successfully',
      },
    });
  }

  // ✅ Delete arrear by ID
  async remove(id: string) {
    const arrear = await this.arrearRepo.findOne({ where: { id } });
    if (!arrear) throw new NotFoundException(`Arrear with ID ${id} not found`);

    await this.arrearRepo.remove(arrear);
    return this._success({
      auth: null,
      data: arrear,
      errors: null,
      links: { self: `/arrears/delete/${id}` },
      included: null,
      message: {
        id: 'Data berhasil dihapus',
        en: 'Data deleted successfully',
      },
    });
  }

  // ✅ Delete multiple arrears by IDs
  async removeBulk(ids: number[]) {
    const arrears = await this.arrearRepo.find({ where: { id: In(ids) } });
    await this.arrearRepo.remove(arrears);
    return this._success({
      auth: null,
      data: { deleted: arrears.length },
      errors: null,
      links: { self: '/arrears/delete-bulk' },
      included: null,
      message: {
        id: 'Data berhasil dihapus (bulk)',
        en: 'Data deleted successfully (bulk)',
      },
    });
  }

  // ✅ Cron job: pindahkan payment overdue ke arrears tiap jam 12 malam
  // @Cron(CronExpression.EVERY_10_SECONDS)
  // async moveOverduePaymentsToArrears() {
  //   const today = new Date();
  //    console.log(
  //      `[CRON JOB] moveOverduePaymentsToArrears running at: ${today.toISOString()}`,
  //    );

  //   const overduePayments = await this.paymentRepository.find({
  //     where: {
  //       status: PaymentStatus.TUNGGAKAN
  //     }
  //   });

  //   console.log(overduePayments);


  //   const arrearsToInsert: Arrears[] = [];
  //   console.log(arrearsToInsert);

  //   for (const payment of overduePayments) {
      
  //     const createdDate = new Date(payment.createdAt);
  //     const range = Math.floor(
  //       (today.getTime() - createdDate.getTime()) / (1000),
  //     );

  //     console.log(range);

  //     if (range >= 10) {
  //        const arrears = await this.arrearsRepository.findOne({
  //          where: {
  //            studentId: payment.studentId,
  //            typeId: payment.typeId,
  //          },
  //        });
  //       console.log(
  //         `[CRON JOB] Payment #${payment.id} overdue (created at ${payment.createdAt}), moving to arrears`,
  //       );
  //       if (!arrears) {
  //          const arrear = this.arrearsRepository.create({
  //            studentId: payment.studentId,
  //            typeId: payment.typeId,
  //            amount: payment.amount,
  //            dueDate: payment.createdAt,
  //            status: 'TUNGGAKAN',
  //            month: new Date().getMonth(),
  //            semester: 5,
  //            TA: `${new Date().getFullYear() + 1}/${new Date().getFullYear() + 2}`,
  //           //  monthsInArrears: 2
  //          });
  //          arrearsToInsert.push(arrear);
  //       }
       

  //       // // update status payment
  //       // payment.status = PaymentStatus.BELUM_LUNAS;
  //       // await this.paymentRepository.save(payment);
  //     }
  //   }
  //   // console.log(arrearsToInsert);

  //  if (arrearsToInsert.length > 0) {
  //    await this.arrearsRepository.save(arrearsToInsert);
  //    console.log(
  //      `[CRON JOB] ${arrearsToInsert.length} payments moved to arrears ✅`,
  //    );
  //  } else {
  //    console.log(`[CRON JOB] No payments to move this run`);
  //  }

  //   return this._success({
  //     auth: null,
  //     data: arrearsToInsert,
  //     errors: null,
  //     links: { self: '/arrears/auto-move' },
  //     included: null,
  //     message: {
  //       id: 'Pembayaran jatuh tempo dipindahkan ke tunggakan',
  //       en: 'Overdue payments moved to arrears',
  //     },
  //   });
  // }

  // Implementasi getStudentsWithArrears sesuai permintaan:
  async getStudentsWithArrears(month?: number, year?: number) {
    const m = month ?? new Date().getMonth() + 1; // 1-12
    const y = year ?? new Date().getFullYear();

    // ambil semua siswa non-deleted
    const students = await this.studentRepo.find({ where: { isDelete: false } });

    const result: any[] = [];

    for (const s of students) {
      // asumsi Student memiliki kolom sppTariff (jika tidak ada, treat 0)
      const sppTariff = (s as any).sppTariff ?? 0;

      // ambil semua pembayaran student untuk bulan/tahun tersebut
      const payments = await this.paymentRepo.find({
        where: { studentId: s.id, month: m, year: y },
      });

      // hitung pembayaran SPP dan pembayaran non-SPP untuk periode itu
      const paidSpp = payments
        .filter((p: any) => (p.feeItem ?? '').toUpperCase() === 'SPP')
        .reduce((sum: number, p: any) => sum + (p.amount ?? 0), 0);

      const paidNonSpp = payments
        .filter((p: any) => (p.feeItem ?? '').toUpperCase() !== 'SPP')
        .reduce((sum: number, p: any) => sum + (p.amount ?? 0), 0);

      const unpaidSpp = Math.max(0, sppTariff - paidSpp);

      // ambil activities/arrears yang belum diselesaikan untuk student ini
      const allArrearsForStudent = await this.arrearRepo.find({
        where: { studentId: s.id },
      });
      const unresolvedArrears = (allArrearsForStudent as any[]).filter((a: any) => a.resolved === false);

      const activitiesTotal = unresolvedArrears.reduce((sum, a: any) => sum + (a.amount ?? 0), 0);

      // kurangi activitiesTotal dengan pembayaran non-SPP pada periode tsb
      const activitiesOutstanding = Math.max(0, activitiesTotal - paidNonSpp);

      // jika pembayaran menutup semua activities, tandai arrear resolved agar hilang di query berikutnya
      if (activitiesTotal > 0 && paidNonSpp >= activitiesTotal) {
        await this.arrearRepo
          .createQueryBuilder()
          .update(Arrears)
          .set({ resolved: true } as any)
          .where('studentId = :id AND resolved = false', { id: s.id })
          .execute();
      }

      const totalOutstanding = unpaidSpp + activitiesOutstanding;

      if (totalOutstanding > 0) {
        result.push({
          student: {
            id: s.id,
            name: s.name,
            NIS: (s as any).NIS,
            NISN: (s as any).NISN,
            dorm: (s as any).dorm,
            generation: s.generation,
            major: s.major,
          },
          month: m,
          year: y,
          spp: {
            tariff: sppTariff,
            paid: paidSpp,
            unpaid: unpaidSpp,
          },
          activities: {
            unresolved: unresolvedArrears, // detail arrear records (may still exist if not fully paid)
            total: activitiesTotal,
            outstanding: activitiesOutstanding,
            paidNonSppInPeriod: paidNonSpp,
          },
          totalOutstanding,
        });
      }
    }

    return this._success({ data: result, meta: { month: m, year: y } });
  }
@Cron('0 0 1 * *') // tiap jam 00:00 tanggal 1

async createMonthlyArrearsForAllStudents() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear().toString();
  const semester = month >= 7 ? 1 : 2;

  console.log(`[CRON] Generate arrears ${month}/${year} semester ${semester}`);

  const students = await this.studentRepo.find({ where: { isDelete: false } });
  if (!students.length) return console.log('[CRON] ❌ No students');

  const paymentTypes = await this.paymentTypeRepo.find(); // Ambil semua type

  // Filter tipe bulanan & semesteran
  const monthlyTypes = (paymentTypes as any[]).filter((pt: any) => pt.semester == 0);
  const semesterTypes = (paymentTypes as any[]).filter((pt: any) => pt.semester == 1);
console.log(semesterTypes)
console.log(monthlyTypes)
  const arrearsToCreate = [];

  for (const student of students) {
    console.log(student)
    const studentAmount = (student as any).sppTariff ?? (student as any).sppAmount ?? 0;

    // Handle monthly payments (Komite, Asrama, SPP, etc)
    for (const type of monthlyTypes) {
      const exists = await this.arrearRepo.findOne({ 
        where: { student: { id: student.id }, month, TA: year, type: { id: type.id } }
      });

      if (!exists) {
        arrearsToCreate.push(this.arrearRepo.create({
          student: { id: student.id },
          type: { id: type.id },
          amount: type.nominal ?? studentAmount,
          status: 'TUNGGAKAN',
          dueDate: today,
          month,
          semester,
          TA: year,
          monthsInArrears: 1,
        }));
      }
    }

    // Handle semester payments (Uang Pangkal & Ujian Semester)
    if ([7, 1].includes(month)) {
      for (const type of semesterTypes) {
        const exists = await this.arrearRepo.findOne({ 
          where: { student: { id: student.id }, month, TA: year, type: { id: type.id } }
        });

        if (!exists) {
          arrearsToCreate.push(this.arrearRepo.create({
            student: { id: student.id },
            type: { id: type.id },
            amount: type.nominal ?? studentAmount,
            status: 'TUNGGAKAN',
            dueDate: today,
            month,
            semester,
            TA: year,
            monthsInArrears: 1,
          }));
        }
      }
    }
  }

  console.log(arrearsToCreate)

  if (!arrearsToCreate.length) return console.log('[CRON] ✅ No new arrears');

  await this.arrearRepo.save(arrearsToCreate);
  console.log(`[CRON] ✅ Created ${arrearsToCreate.length} arrears`);
}



 async getStudentUnpaidMonths(studentId: string, year?: number) {
    const y = year ?? new Date().getFullYear();

    const student = await this.studentRepo.findOne({ where: { id: studentId, isDelete: false } });
    if (!student) throw new NotFoundException('Student not found');

    // Ambil tarif SPP dari student (fallback jika beda nama field)
    const sppTariff = (student as any).sppTariff ?? (student as any).sppAmount ?? 0;
    if (sppTariff <= 0) {
      return this._success({
        data: {
          student: { id: student.id, name: student.name },
          year: y,
          unpaidMonths: [],
          unpaidCount: 0,
          note: 'No SPP tariff configured for this student',
        },
      });
    }

    // Ambil semua pembayaran student untuk tahun tersebut
    const payments = await this.paymentRepo.find({
      where: { student: { id: studentId }, year: y } as any,
    });

    // Group pembayaran SPP per bulan dan total pembayaran non-SPP (dipakai untuk menutup arrears kegiatan)
    const paidByMonth = new Map<number, number>();
    let paidNonSppTotal = 0;
    for (const p of payments) {
      const feeItem = (p as any).feeItem ? String((p as any).feeItem).toLowerCase() : '';
      const amount = Number((p as any).amount ?? 0);
      if (!feeItem || feeItem === 'spp') {
        const m = Number((p as any).month ?? 0) || 0;
        if (m > 0) {
          paidByMonth.set(m, (paidByMonth.get(m) ?? 0) + amount);
        }
      } else {
        paidNonSppTotal += amount;
      }
    }

    // Hitung bulan yang belum bayar penuh SPP
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const unpaidMonths: { month: number; paid: number; expected: number; remaining: number }[] = [];

    for (let month = 1; month <= 12; month++) {
      // Optional: jika meminta tahun sekarang, abaikan bulan ke depan
      if (y === currentYear && month > currentMonth) break;

      const paid = paidByMonth.get(month) ?? 0;
      const remaining = Math.max(0, sppTariff - paid);
      if (remaining > 0) {
        unpaidMonths.push({ month, paid, expected: sppTariff, remaining });
      }
    }

    // Ambil arrears (kegiatan lain) yang belum diselesaikan
    const unresolvedArrears = await this.arrearRepo.find({
      where: { student: { id: studentId }, resolved: false } as any,
      relations: ['type'], // jika ada relasi type
    });
    const totalArrearsAmount = (unresolvedArrears as any[]).reduce(
      (s, a) => s + (Number((a as any).amount ?? 0)),
      0,
    );

    // Jika pembayaran non-SPP di tahun ini menutup semua arrears, tandai resolved
    if (totalArrearsAmount > 0 && paidNonSppTotal >= totalArrearsAmount) {
      await this.arrearRepo
        .createQueryBuilder()
        .update()
        .set({ resolved: true } as any)
        .where('studentId = :id AND resolved = false', { id: studentId })
        .execute();
    }

    // Jika sudah di-resolve, ambil kembali unresolved (atau kosongkan jika diselesaikan)
    const finalUnresolved = (totalArrearsAmount > 0 && paidNonSppTotal >= totalArrearsAmount)
      ? []
      : unresolvedArrears;

    const totalOutstandingSpp = unpaidMonths.reduce((s, m) => s + m.remaining, 0);
    const totalOutstanding = totalOutstandingSpp + finalUnresolved.reduce((s, a) => s + (Number((a as any).amount ?? 0)), 0);

    return this._success({
      data: {
        student: {
          id: student.id,
          name: student.name,
          NIS: (student as any).NIS,
          NISN: (student as any).NISN,
        },
        year: y,
        spp: {
          tariff: sppTariff,
          unpaidMonths,
          totalOutstandingSpp,
        },
        activities: {
          unresolved: finalUnresolved,
          totalArrearsAmount: finalUnresolved.reduce((s, a) => s + (Number((a as any).amount ?? 0)), 0),
          paidNonSppInYear: paidNonSppTotal,
        },
        totalOutstanding,
      },
      meta: { year: y },
    });
  }

  /**
   * Alokasi pembayaran SPP untuk student berdasarkan studentId.
   * - Jika month disediakan: bayar bulan itu (bisa partial atau lebih -> akan disimpan)
   * - Jika month tidak disediakan: alokasikan ke bulan terawal (1..12) yang belum lunas di tahun tsb
   */
  async paySppByStudentId(opts: {
    studentId: string;
    amount: number;
    year?: number;
    month?: number;
    note?: string;
  }) {
    const { studentId, amount: initialAmount, year = new Date().getFullYear(), month, note } = opts;
    if (!initialAmount || initialAmount <= 0) throw new BadRequestException('Amount harus > 0');

    const student = await this.studentRepo.findOne({ where: { id: studentId, isDelete: false } });
    if (!student) throw new NotFoundException('Student not found');

    const sppTariff = (student as any).sppTariff ?? (student as any).sppAmount ?? 0;
    if (sppTariff <= 0) {
      throw new BadRequestException('SPP tariff not configured for this student');
    }

    let remainingAmount = Number(initialAmount);
    const paymentsMade: any[] = [];

    // helper untuk apply pembayaran ke bulan tertentu
    const applyToMonth = async (m: number) => {
      if (remainingAmount <= 0) return;
      let payment: any = await this.paymentRepo.findOne({
        where: { studentId, month: m, year, feeItem: 'SPP' } as any,
      });

      const alreadyPaid = payment ? Number(payment.amount ?? 0) : 0;
      const need = Math.max(0, sppTariff - alreadyPaid);
      if (need <= 0) return; // sudah lunas

      const pay = Math.min(need, remainingAmount);

      if (payment) {
        payment.amount = alreadyPaid + pay;
        if ('updatedAt' in payment) (payment as any).updatedAt = new Date();
      } else {
        payment = this.paymentRepo.create({
          studentId,
          month: m,
          year,
          amount: pay,
          feeItem: 'SPP',
          description: note ?? 'Pembayaran SPP via admin',
          createdAt: new Date(),
        } as any);
      }

      const saved = await this.paymentRepo.save(payment);
      paymentsMade.push({ month: m, paid: pay, totalPaidForMonth: saved.amount });
      remainingAmount -= pay;
    };

    if (month && month >= 1 && month <= 12) {
      // bayar khusus bulan
      await applyToMonth(month);
    } else {
      // alokasikan dari bulan 1 sampai 12 (atau sampai remainingAmount habis)
      for (let m = 1; m <= 12; m++) {
        // optional: jika year == currentYear, hanya alokasikan sampai bulan sekarang
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
        if (year === currentYear && m > currentMonth) break;

        if (remainingAmount <= 0) break;
        await applyToMonth(m);
      }
    }

    // setelah apply, cek dan resolve arrears (kegiatan) jika pembayaran non-spp menutupnya
    // (di sini pembayaran diarahkan ke SPP; jika ingin juga alokasi ke arrears non-SPP,
    // perlu perubahan: menerima flag alokasi ke activities)
    // Namun jika ada pembayaran non-SPP di paymentRepo yang menutup activities, service lain bisa handle.

    // Hitung kembali status lunas bulan-bulan yang terkena pembayaran
    const unpaidMonthsAfter: any[] = [];
    for (let m = 1; m <= 12; m++) {
      if (year === new Date().getFullYear() && m > new Date().getMonth() + 1) break;
      const p = await this.paymentRepo.findOne({ where: { studentId, month: m, year, feeItem: 'SPP' } as any });
      const paid = p ? Number(p.amount ?? 0) : 0;
      const remainingForMonth = Math.max(0, sppTariff - paid);
      if (remainingForMonth > 0) unpaidMonthsAfter.push({ month: m, paid, remaining: remainingForMonth });
    }

    return this._success({
      data: {
        studentId,
        year,
        initialAmount,
        remainingAmount,
        paymentsMade,
        unpaidMonthsAfter,
        note: 'Pembayaran SPP dialokasikan ke bulan terawal yang belum lunas (jika month tidak disediakan)',
      },
    });
  }
}
