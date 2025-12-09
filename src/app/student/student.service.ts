import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './student.entity';
import { Payment } from '../payment/payment.entity';
import { PaymentType } from '../payment/payment-type/payment-type.entity';
import { CreateStudentDto } from './student.dto';
import { SppPayment } from '../spp-payment/spp-payment.entity';
import { spawn } from 'child_process';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,

    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,

    @InjectRepository(SppPayment)
    private SPrepo: Repository<SppPayment>,

    @InjectRepository(PaymentType)
    private paymentTypeRepository: Repository<PaymentType>,
  ) {}

  // ✅ CREATE STUDENT + AUTO 36 BULAN SPP
  async create(createStudentDto: CreateStudentDto) {
    const student = this.studentRepository.create(createStudentDto);
    const savedStudent = await this.studentRepository.save(student);

    // Buat 36 bulan data SPP otomatis (3 tahun)
    const sppList: SppPayment[] = [];
    const startDate = new Date();
    const months = [
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

    for (let i = 0; i < 36; i++) {
      const date = new Date(startDate);
      date.setMonth(startDate.getMonth() + i);

      const sppPayment = new SppPayment();
      sppPayment.student = savedStudent;
      sppPayment.studentId = savedStudent.id;
      sppPayment.month = months[date.getMonth()];
      sppPayment.year = date.getFullYear().toString();
      sppPayment.nominal =
        savedStudent.tipeProgram == 'FULLDAY' ? 1000000 : 2500000;
      sppPayment.status = 'BELUM_LUNAS';
      sppPayment.paidAt = null;
      sppPayment.remainder =
        savedStudent.tipeProgram == 'FULLDAY' ? 1000000 : 2500000;
      sppPayment.paid = 0;

      sppList.push(sppPayment);
    }

    await this.SPrepo.save(sppList);

    return {
      message: 'Student created successfully with 36 months of SPP data',
      data: savedStudent,
    };
  }

  async createMany(createStudentDtos: CreateStudentDto[]) {
    // 1. Buat entity student banyak sekaligus
    const studentEntities = this.studentRepository.create(createStudentDtos);

    // 2. Save semua student langsung bulk insert
    const savedStudents = await this.studentRepository.save(studentEntities);

    // 3. Buat 36 bulan data SPP untuk tiap student
    const sppList: SppPayment[] = [];
    const startDate = new Date();

    const months = [
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

    for (const student of savedStudents) {
      for (let i = 0; i < 36; i++) {
        const date = new Date(startDate);
        date.setMonth(startDate.getMonth() + i);

        // Jika belum ada tipeProgram, set default nominal = 0
        const nominal = 0;

        const sppPayment = new SppPayment();
        sppPayment.student = student;
        sppPayment.studentId = student.id;
        sppPayment.month = months[date.getMonth()];
        sppPayment.year = date.getFullYear().toString();
        sppPayment.nominal = nominal;
        sppPayment.status = 'BELUM_LUNAS';
        sppPayment.paidAt = null;
        sppPayment.remainder = nominal;
        sppPayment.paid = 0;

        sppList.push(sppPayment);
      }
    }

    // 4. Save semua SPP sekaligus
    await this.SPrepo.save(sppList);

    return {
      message: `${savedStudents.length} students created with 36 months of SPP each`,
      data: savedStudents,
    };
  }

  // ✅ GET SEMUA STUDENT + DATA SPP
  async findAll() {
    const students = await this.studentRepository.find({
      relations: ['spp'],
      order: { createdAt: 'DESC' },
    });

    return {
      message: 'List of all students with SPP data',
      total: students.length,
      data: students,
    };
  }

  // ✅ GET STUDENT BERDASARKAN ID
  async findOne(id: string) {
    const student = await this.studentRepository.findOne({
      where: { id },
      relations: ['spp'],
    });

    if (!student) throw new NotFoundException('Student not found');

    return {
      message: 'Student found',
      data: student,
    };
  }

  // ✅ DELETE STUDENT (otomatis hapus SPP karena relasi onDelete: CASCADE)
  async remove(id: string) {
    const student = await this.studentRepository.findOne({ where: { id } });
    if (!student) throw new NotFoundException('Student not found');

    await this.studentRepository.remove(student);

    return {
      message: 'Student and related SPP data deleted successfully',
    };
  }
}
