import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './student.entity';
import { Payment } from '../payment/payment.entity';
import { PaymentType } from '../payment/payment-type/payment-type.entity';
import { CreateStudentDto } from './student.dto';
import { SppPayment } from '../spp-payment/spp-payment.entity';
import { spawn } from 'child_process';
import { StudentStatus } from './student.enum';
import { BaseResponse } from 'src/utils/response/base.response';

@Injectable()
export class StudentService extends BaseResponse {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,

    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,

    @InjectRepository(SppPayment)
    private SPrepo: Repository<SppPayment>,

    @InjectRepository(PaymentType)
    private paymentTypeRepository: Repository<PaymentType>,
  ) {
    super();
  }

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
    // === 1. Bulk Insert Student (1 QUERY SAJA) ===
    const studentEntities = this.studentRepository.create(createStudentDtos);
    const savedStudents = await this.studentRepository.save(studentEntities);

    // === 2. Generate Bulk SPP untuk 3 tahun ajaran ===

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

    const sppList = savedStudents.flatMap((student) => {
      const startYear = new Date().getFullYear() // Tahun siswa masuk sekolah
      const startMonthIndex = 6; // Juli (index ke-6)

      return Array.from({ length: 36 }).map((_, i) => {
        // bulan + tahun bergeser otomatis
        const d = new Date(startYear, startMonthIndex + i);

        const nominal = student.tipeProgram === 'FULLDAY' ? 1000000 : 2500000;

        return {
          studentId: student.id,
          month: months[d.getMonth()],
          year: d.getFullYear().toString(),
          nominal,
          status: 'BELUM_LUNAS',
          paidAt: null,
          paid: 0,
          remainder: nominal,
        };
      });
    });

    // === 3. Bulk Insert SPP (1 QUERY SAJA) ===
    await this.SPrepo.createQueryBuilder()
      .insert()
      .into(SppPayment)
      .values(sppList)
      .execute();

    return {
      message: `${savedStudents.length} students created with 36 months of SPP each based on academic year`,
      data: savedStudents,
    };
  }

  // ✅ GET SEMUA STUDENT + DATA SPP
  async findAll() {
    const students = await this.studentRepository.find({
      relations: ['spp'],
      where: { isDelete: false },
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

  async DeleteStudentStatus(id: string) {
    const student = await this.studentRepository.findOne({
      where: {
        id,
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    await this.studentRepository.update(id, {
      isDelete: true,
    });

    return this._success({
      data: student,
    });
  }

  async updateStudent(id: string, payload: any) {
    const student = await this.studentRepository.findOne({
      where: {
        id,
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    await this.studentRepository.update(id, payload);
  }
}
