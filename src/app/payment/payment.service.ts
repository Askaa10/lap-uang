import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, MoreThan, Repository } from 'typeorm';
import { Payment, PaymentStatus } from './payment.entity';
import { PaymentType } from './payment-type/payment-type.entity';
import { CreatePaymentDto, UpdatePaymentDto } from './payment.dto';
import { BaseResponse } from 'src/utils/response/base.response';
import { Student } from '../student/student.entity';
import { snakeCase } from 'lodash';
import { SppPayment } from '../spp-payment/spp-payment.entity';
import {
  PaymentHistory,
  PaymentHistoryStatus,
} from './payment-history/payment-history.entity';

@Injectable()
export class PaymentService extends BaseResponse {
  constructor(
    @InjectRepository(PaymentHistory)
    private readonly paymentHistoryRepo: Repository<PaymentHistory>,
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,

    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,

    @InjectRepository(PaymentType)
    private readonly paymentTypeRepo: Repository<PaymentType>,

    @InjectRepository(SppPayment)
    private readonly sppPaymentRepo: Repository<SppPayment>,

    @InjectRepository(SppPayment)
    private readonly paymentSPPRepo: Repository<SppPayment>,
  ) {
    super();
  }

  // ✅ CREATE PAYMENT
  async create(dto: CreatePaymentDto) {
    const student = await this.studentRepo.findOneBy({ id: dto.studentId });
    if (!student) throw new NotFoundException('Student not found');

    const type = await this.paymentTypeRepo.findOneBy({ id: dto.typeId });
    if (!type) throw new NotFoundException('Payment type not found');

    // 🔍 Ambil semua payment sebelumnya untuk jenis pembayaran ini
    const previousPayments = await this.paymentRepo.find({
      where: {
        student: { id: dto.studentId },
        type: { id: dto.typeId },
      },
    });

    const alreadyPaid = previousPayments.reduce((sum, p) => sum + p.paid, 0);
    const totalPaid = alreadyPaid + dto.amount;

    if (totalPaid > type.nominal) {
      throw new BadRequestException(
        'Jumlah pembayaran melebihi total nominal!',
      );
    }

    // 💰 Hitung status & remainder
    let status = PaymentStatus.BELUM_LUNAS;
    let remainder = type.nominal - totalPaid;

    if (totalPaid === type.nominal) {
      status = PaymentStatus.LUNAS;
      remainder = 0;
    }

    const payment = this.paymentRepo.create({
      ...dto,
      student,
      type,
      paid: dto.amount,
      remainder,
      status,
    });

    const saved = await this.paymentRepo.save(payment);

    return this._success({
      message: {
        en: 'Payment created successfully',
        id: 'Pembayaran berhasil dibuat',
      },
      data: {
        ...saved,
        type,
        typeText: type.type,
        totalPaid,
        remainder,
        status,
      },
    });
  }
  async getTagihanByNisn(nisn: string) {
    // TAGIHAN PAYMENT TYPE NORMAL
    const payments = await this.paymentRepo.find({
      relations: ['student', 'type'],
      where: {
        status: PaymentStatus.BELUM_LUNAS,
        student: { NISN: nisn },
      },
    });
  
    // TAGIHAN SPP

    const sppPayment = await this.sppPaymentRepo.find({
      relations: ['student'], // SPP tidak punya paymentType
      where: {
        status: 'BELUM_LUNAS',
        student: { NISN: nisn },
      },
    });
  
   
    const formatted = [
      ...payments.map((p) => ({
        id: p.id,
        namaPembayaran: p.type?.name,     // <-- nama payment type
        kategori: p.type?.type,           // <-- kategori (BULANAN / INSTALMENT / NORMAL)
        nominal: p.type?.nominal ?? p.amount,
        amount: p.amount,
        remainder: p.remainder,
        status: p.status,
        tanggalDibuat: p.createdAt,
      })),
  
      ...sppPayment.map((spp) => ({
        id: spp.id,
        // namaPembayaran: `SPP Bulanan`,
        kategori: "SPP",
        bulan: spp.month,
        tahun: spp.year,
        nominal: 2500000,
        remainder: spp.remainder,
        status: spp.status,
        tanggalDibuat: spp.createdAt,
    })),
  ]
  

    return this._success({
      message: { en: 'Payment fetched successfully', id: 'Pembayaran berhasil diambil' },
      data: formatted
      message: {
        en: 'Payment fetched successfully',
        id: 'Pembayaran berhasil diambil',
      },
      data: [...payments, ...sppPayment],
    });
  }

  async getTagihanSakuSaku(NISN: string, secureCode) {
    if (secureCode !== 'mqmaju123') {
      throw new HttpException('Gagal Ambil data karena code salah', 401);
    }
    const payment = await this.paymentRepo.find({
      where: { student: { NISN }, status: PaymentStatus.BELUM_LUNAS },
      relations: ['type'],
    });

    const spp = await this.paymentSPPRepo.find({
      where: { student: { NISN }, status: 'BELUM_LUNAS' },
      relations: [],
    });
    const sppDone = await this.paymentSPPRepo.find({
      where: { student: { NISN }, paid: MoreThan(0) },
      relations: [],
    });

    const history = await this.paymentHistoryRepo.find({
      where: { student: { NISN } },
    });

    return this._success({
      data: {
        oltherPayments: payment,
        sppPayment: spp,
        history: {
          spp: sppDone,
          olther: history,
        },
      },
    });
  }

  async bayarTagihanSakuSaku(body: any) {
    const { jenis, nisn, jumlah, bulan, tahun, metode } = body;

    const student = await this.studentRepo.findOne({
      where: { NISN: nisn },
    });

    if (jenis.toLowerCase() === 'spp') {
      const MONTHS_ORDER = [
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

      let paymentAmount = Number(jumlah);

      // Ambil semua spp student
      let sppList = await this.sppPaymentRepo.find({
        where: { studentId: student.id },
      });

      // Filter list: hanya yang belum lunas
      sppList = sppList.filter((spp) => spp.status !== 'LUNAS');

      // Sort dengan prioritas:
      // 1. Yang nyicil dulu
      // 2. Baru yang belum bayar sama sekali
      // 3. Urut tahun + bulan
      const sorted = sppList.sort((a, b) => {
        // Prioritas yang nyicil
        if (a.paid > 0 && b.paid === 0) return -1;
        if (a.paid === 0 && b.paid > 0) return 1;

        // Kalau sama kategori, urut berdasarkan tahun dulu
        if (a.year !== b.year) return Number(a.year) - Number(b.year);

        // Lalu urut bulan
        return MONTHS_ORDER.indexOf(a.month) - MONTHS_ORDER.indexOf(b.month);
      });

      // APPLY PAYMENT
      for (const spp of sorted) {
        if (paymentAmount <= 0) break;

        const nominal = spp.nominal;
        const alreadyPaid = spp.paid || 0;
        const remaining = nominal - alreadyPaid;

        if (remaining <= 0) continue; // skip kalau entah kenapa udah lunas

        if (paymentAmount >= remaining) {
          // Bayar full
          spp.paid = nominal;
          spp.remainder = 0;
          spp.status = 'LUNAS';
          spp.paidAt = new Date();

          paymentAmount -= remaining;
        } else {
          // Partial payment
          spp.paid += paymentAmount;
          spp.remainder = nominal - spp.paid;
          spp.status = 'BELUM_LUNAS';

          paymentAmount = 0;
        }

        await this.sppPaymentRepo.save(spp);
      }

      return this._success({
        message: {
          en: 'success',
          id: 'Pembayaran SPP berhasil diproses.',
        },
        data: body,
      });
    } else {
      const pt = await this.paymentTypeRepo.findOne({
        where: { name: jenis },
      });

      if (!pt) {
        throw new HttpException('Tipe pembayaran tidak ditemukan', 404);
      }

      // Ambil pembayaran aktif siswa berdasar tipe
      const py = await this.paymentRepo.findOne({
        where: {
          student: { NISN: nisn },
          type: { id: pt.id },
        },
        relations: ['student', 'type'],
      });

      if (!py) {
        throw new HttpException('Pembayaran tidak ditemukan', 404);
      }

      const bayar = Number(jumlah);
      const updatedRemainder = py.amount - bayar;

      // Hitung refund jika overpay
      let refund = 0;
      if (updatedRemainder < 0) {
        refund = Math.abs(updatedRemainder);
      }

      // Simpan PaymentHistory dulu
      const praHistory = {
        paymentId: py.id,
        studentId: py.student.id,
        date: new Date(),
        status:
          updatedRemainder <= 0
            ? PaymentHistoryStatus.LUNAS
            : PaymentHistoryStatus.BELUM_LUNAS,
        amount: bayar,
        method: metode,
        month: py.month,
        year: tahun,
        remainder: Math.max(updatedRemainder, 0), // biar ga minus di history
        paid: bayar,
        type: { id: pt.id } as any,
      };

      await this.paymentHistoryRepo.save(praHistory);

      // Jika lunas → hapus payment dari list
      if (updatedRemainder <= 0) {
        await this.paymentRepo.delete(py.id);
        return this._success({
          message: {
            en: "success",
            id: "Pembayaran sudah lunas dan dihapus dari list"
          },
          data: {
           refund,
         }
       })
      } else {
        // Jika belum lunas → update
        await this.paymentRepo.update(
          { id: py.id },
          {
            remainder: updatedRemainder,
            paid: py.paid + bayar, // total paid cumulative
          },
        );
        console.log('Payment masih nyicil, hanya update');
      }

      return this._success({
        message: {
          en: 'success',
          id: 'Pembayaran berhasil diproses',
        },
        data: {
          refund,
        },
      });
    }

  }

  
  // ✅ CREATE BULK
  async createBulk(dtos: CreatePaymentDto[]) {
    const payments = await Promise.all(
      dtos.map(async (dto) => {
        const student = await this.studentRepo.findOneBy({ id: dto.studentId });
        const type = await this.paymentTypeRepo.findOneBy({ id: dto.typeId });

        if (!student || !type) return null;

        return this.paymentRepo.create({
          ...dto,
          student,
          type,
          status: PaymentStatus.LUNAS,
        });
      }),
    );

    const validPayments = payments.filter((p): p is Payment => p !== null);

    if (validPayments.length === 0) {
      return this._success({
        message: {
          en: 'No valid payments to create',
          id: 'Tidak ada pembayaran valid untuk dibuat',
        },
        data: [],
      });
    }

    const saved = await this.paymentRepo.save(validPayments);

    return this._success({
      message: {
        en: 'Payments created successfully',
        id: 'Pembayaran berhasil dibuat',
      },
      data: saved,
    });
  }

  // ✅ FIND ALL
  async findAll() {
    const payments = await this.paymentRepo.find({
      relations: ['student', 'type'],
    });
    return this._success({
      message: { en: 'List of all payments', id: 'Daftar semua pembayaran' },
      meta: { total: payments.length },
      data: payments,
    });
  }

  // ✅ FIND ONE
  async findOne(id: string) {
    const payment = await this.paymentRepo.findOne({
      where: { id },
      relations: ['student', 'type'],
    });

    if (!payment) throw new NotFoundException('Payment not found');

    return this._success({
      message: {
        en: 'Payment fetched successfully',
        id: 'Pembayaran berhasil diambil',
      },
      data: payment,
    });
  }

  // ✅ UPDATE PAYMENT
  async updatePayment(
    studentId: string,
    typeId: string,
    year: number,
    updateDto: { status?: string; amount?: number },
  ) {
    const payment = await this.paymentRepo.findOne({
      where: { student: { id: studentId }, type: { id: typeId }, year },
      relations: ['student', 'type'],
    });

    if (!payment) throw new NotFoundException('Payment tidak ditemukan');

    if (updateDto.status) {
      // cast the incoming status string to the PaymentStatus enum
      payment.status = updateDto.status as unknown as PaymentStatus;
    }

    if (updateDto.amount !== undefined) {
      payment.amount = updateDto.amount;
    }

    const saved = await this.paymentRepo.save(payment);

    return this._success({
      message: {
        en: 'Payment updated successfully',
        id: 'Pembayaran berhasil diperbarui',
      },
      data: {
        studentId: saved.student.id,
        typeId: saved.type.id,
        typeName: saved.type.name,
        amount: saved.amount,
        status: saved.status,
      },
    });
  }

  // ✅ REMOVE PAYMENT
  async remove(id: string) {
    const payment = await this.paymentRepo.findOne({
      where: { id },
      relations: ['student', 'type'],
    });
    if (!payment) throw new NotFoundException('Payment not found');

    await this.paymentRepo.remove(payment);

    return this._success({
      message: {
        en: 'Payment deleted successfully',
        id: 'Pembayaran berhasil dihapus',
      },
      data: payment,
    });
  }

  // ✅ GROUPED PAYMENTS
  async getGroupedPaymentsByStudent(typeId: string) {
    const payments = await this.paymentRepo.find({
      where: { type: { id: typeId } },
      relations: ['student', 'type'],
      order: { date: 'ASC' },
    });

    const grouped = payments.reduce(
      (acc, curr) => {
        const key = curr.student.id;

        if (!acc[key]) {
          acc[key] = {
            studentId: curr.student.id,
            nama: curr.student.name,
            tipeKategori: curr.type.name,
            jumlahTagihan: curr.type.nominal,
            jumlahPembayaran: curr.amount,
            jumlahTransaksi: 1,
            jumlahHarusDibayar: curr.type.nominal - curr.amount,
            status:
              curr.amount >= curr.type.nominal
                ? PaymentStatus.LUNAS
                : PaymentStatus.BELUM_LUNAS,
            firstPaymentDate: curr.date,
            lastPaymentDate: curr.date,
          };
        } else {
          acc[key].jumlahPembayaran += curr.amount;
          acc[key].jumlahTransaksi += 1;
          acc[key].jumlahHarusDibayar =
            acc[key].jumlahTagihan - acc[key].jumlahPembayaran;
          acc[key].status =
            acc[key].jumlahPembayaran >= acc[key].jumlahTagihan
              ? PaymentStatus.LUNAS
              : PaymentStatus.BELUM_LUNAS;
          acc[key].lastPaymentDate = curr.date;
        }

        return acc;
      },
      {} as Record<string, any>,
    );

    const data = Object.values(grouped).map((item: any, i) => ({
      no: i + 1,
      ...item,
    }));

    return this._success({ data });
  }

  // ✅ PAYMENTS BY CATEGORY
  async paymentsByCategory(kategoriName: string) {
    const payments = await this.paymentRepo.find({
      where: {
        type: { name: kategoriName },
        student: { isDelete: false },
      },
      relations: ['student', 'type'],
    });

    return this._success({ data: payments });
  }

  // ✅ GET PAYMENT BY STUDENT + TYPE
  async getPaymentsByCNS(studentId: string, typeId: string) {
    const payments = await this.paymentRepo.find({
      where: { student: { id: studentId }, type: { id: typeId } },
      relations: ['student', 'type'],
    });

    return this._success({ data: payments });
  }

  // ✅ REKAP BULANAN
  async rekapBulanan(year: number) {
    const students = await this.studentRepo.find({
      where: { isDelete: false },
      relations: ['payments', 'payments.type'],
    });

    const paymentTypes = await this.paymentTypeRepo.find();

    const result = students.map((student) => {
      const payments = paymentTypes.map((type) => ({
        category: snakeCase(type.name),
        status: 'BELUM_LUNAS',
      }));

      student.payments.forEach((payment) => {
        const key = snakeCase(payment.type?.name);
        const index = payments.findIndex((p) => p.category === key);

        // tentukan status dulu
        const paymentStatus =
          payment.status === PaymentStatus.LUNAS
            ? 'LUNAS'
            : payment.status === PaymentStatus.BELUM_LUNAS
              ? 'BELUM_LUNAS'
              : 'TUNGGAKAN';

        // update jika kategori ditemukan
        if (index !== -1) {
          payments[index].status = paymentStatus;
        }
      });

      return { name: student.name, payments };
    });

    return this._success({ data: result });
  }
}
