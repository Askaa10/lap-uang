import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PaymentType } from './payment-type.entity';
import { CreatePaymentTypeDto, UpdatePaymentTypeDto } from './payment-type.dto';
import { BaseResponse } from '../../../utils/response/base.response';
import { Student } from '../../student/student.entity'; // ✅ import Student

@Injectable()
export class PaymentTypeService extends BaseResponse {
  constructor(
    @InjectRepository(PaymentType)
    private readonly repo: Repository<PaymentType>,

    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>, // ✅ tambahkan repository Student
  ) {
    super();
  }

  // ✅ saat membuat PaymentType baru, semua siswa otomatis ditambahkan
  async create(dto: CreatePaymentTypeDto) {
    let students = [];
  
    console.log('👉 studentIds dari FE:', dto.studentIds);
  
    if (Array.isArray(dto.studentIds) && dto.studentIds.length > 0) {
      // ✅ Ambil siswa berdasarkan ID yang dikirim
      students = await this.studentRepo.findBy({
        id: In(dto.studentIds),
      });
  
      if (students.length === 0) {
        throw new NotFoundException('Siswa tidak ditemukan untuk ID yang dikirim');
      }
    } else {
      // ✅ Jika tidak dikirim, ambil semua siswa
      console.log('⚠️ Tidak ada studentIds dikirim — otomatis ambil semua siswa');
      students = await this.studentRepo.find(); // ambil semua siswa di database
    }
  
    const paymentType = this.repo.create({
      ...dto,
      students,
    });
  
    const saved = await this.repo.save(paymentType);
  
    return {
      success: true,
      message: {
        id: `Payment type berhasil dibuat untuk ${students.length} siswa`,
        en: `Payment type created for ${students.length} students`,
      },
      data: saved,
    };
  }
  async findAll() {
    const types = await this.repo.find({ relations: ['students'] }); // ✅ tampilkan relasi students
    return this._success({
      auth: null,
      data: types,
      errors: null,
      links: { self: '/payment-types/all' },
      included: null,
      message: {
        id: 'Data berhasil diambil',
        en: 'Data fetched successfully',
      },
    });
  }

  async findOne(id: string) {
    const found = await this.repo.findOne({ where: { id }, relations: ['students'] }); // ✅ tampilkan siswa terkait
    if (!found) throw new NotFoundException('Payment type not found');
    return this._success({
      auth: null,
      data: found,
      errors: null,
      links: { self: `/payment-types/detail/${id}` },
      included: null,
      message: {
        id: 'Data ditemukan',
        en: 'Data found',
      },
    });
  }

  async update(id: string, dto: UpdatePaymentTypeDto) {
    const existing = await this.repo.preload({ id, ...dto });
    if (!existing) throw new NotFoundException('Payment type not found');

    const updated = await this.repo.save(existing);
    return this._success({
      auth: null,
      data: updated,
      errors: null,
      links: { self: `/payment-types/update/${id}` },
      included: null,
      message: {
        id: 'Data berhasil diperbarui',
        en: 'Data updated successfully',
      },
    });
  }

  async remove(id: string) {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) throw new NotFoundException('Payment type not found');

    await this.repo.remove(found);
    return this._success({
      auth: null,
      data: found,
      errors: null,
      links: { self: `/payment-types/delete/${id}` },
      included: null,
      message: {
        id: 'Data berhasil dihapus',
        en: 'Data deleted successfully',
      },
    });
  }
}
