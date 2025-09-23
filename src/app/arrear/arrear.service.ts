// src/arrears/arrears.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository, In } from 'typeorm';
import { Arrears } from './arrear.entity';
import { ArrearsDto } from './arrear.dto';
import { BaseResponse } from 'src/utils/response/base.response';
import { Payment, PaymentStatus } from '../payment/payment.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
@Injectable()
export class ArrearsService extends BaseResponse {
  constructor(
    @InjectRepository(Arrears)
    private arrearsRepository: Repository<Arrears>,

    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {
    super();
  }

  // ✅ Create single arrear
  async create(dto: any) {
    const arrear = this.arrearsRepository.create(dto);
    const saved = await this.arrearsRepository.save(arrear);
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
    const arrears = this.arrearsRepository.create(dtos);
    const saved = await this.arrearsRepository.save(arrears);
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
    const data = await this.arrearsRepository.find();
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
    const arrear = await this.arrearsRepository.findOne({ where: { id } });
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
    const arrear = await this.arrearsRepository.preload({ id, ...dto });
    if (!arrear) throw new NotFoundException(`Arrear with ID ${id} not found`);

    const updated = await this.arrearsRepository.save(arrear);
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
    const arrear = await this.arrearsRepository.findOne({ where: { id } });
    if (!arrear) throw new NotFoundException(`Arrear with ID ${id} not found`);

    await this.arrearsRepository.remove(arrear);
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
    const arrears = await this.arrearsRepository.find({ where: { id: In(ids) } });
    await this.arrearsRepository.remove(arrears);
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
  @Cron(CronExpression.EVERY_10_SECONDS)
  async moveOverduePaymentsToArrears() {
    const today = new Date();
     console.log(
       `[CRON JOB] moveOverduePaymentsToArrears running at: ${today.toISOString()}`,
     );

    const overduePayments = await this.paymentRepository.find({
      where: {
        status: PaymentStatus.TUNGGAKAN
      }
    });

    console.log(overduePayments);


    const arrearsToInsert: Arrears[] = [];
    console.log(arrearsToInsert);

    for (const payment of overduePayments) {
      
      const createdDate = new Date(payment.createdAt);
      const range = Math.floor(
        (today.getTime() - createdDate.getTime()) / (1000),
      );

      console.log(range);

      if (range >= 10) {
         const arrears = await this.arrearsRepository.findOne({
           where: {
             studentId: payment.studentId,
             typeId: payment.typeId,
           },
         });
        console.log(
          `[CRON JOB] Payment #${payment.id} overdue (created at ${payment.createdAt}), moving to arrears`,
        );
        if (!arrears) {
           const arrear = this.arrearsRepository.create({
             studentId: payment.studentId,
             typeId: payment.typeId,
             amount: payment.amount,
             dueDate: payment.createdAt,
             status: 'TUNGGAKAN',
             month: new Date().getMonth(),
             semester: 5,
             TA: `${new Date().getFullYear() + 1}/${new Date().getFullYear() + 2}`,
            //  monthsInArrears: 2
           });
           arrearsToInsert.push(arrear);
        }
       

        // // update status payment
        // payment.status = PaymentStatus.BELUM_LUNAS;
        // await this.paymentRepository.save(payment);
      }
    }
    // console.log(arrearsToInsert);

   if (arrearsToInsert.length > 0) {
     await this.arrearsRepository.save(arrearsToInsert);
     console.log(
       `[CRON JOB] ${arrearsToInsert.length} payments moved to arrears ✅`,
     );
   } else {
     console.log(`[CRON JOB] No payments to move this run`);
   }

    return this._success({
      auth: null,
      data: arrearsToInsert,
      errors: null,
      links: { self: '/arrears/auto-move' },
      included: null,
      message: {
        id: 'Pembayaran jatuh tempo dipindahkan ke tunggakan',
        en: 'Overdue payments moved to arrears',
      },
    });
  }
}
