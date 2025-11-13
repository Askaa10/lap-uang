import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from './payment.entity';

@Injectable()
export class PaymentScheduler {
  private readonly logger = new Logger(PaymentScheduler.name);

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
  ) {}

  // 🔥 Setiap awal bulan   
  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async markOverduePayments() {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const overdue = await this.paymentRepo.find({
      where: {
        status: PaymentStatus.BELUM_LUNAS,
        year: lastMonth.getFullYear(),
        month: lastMonth.getMonth() + 1,
      },
    });

    if (overdue.length > 0) {
      overdue.forEach((p) => (p.status = PaymentStatus.TUNGGAKAN));
      await this.paymentRepo.save(overdue);
      this.logger.log(`✅ Marked ${overdue.length} overdue payments as TUNGGAKAN`);
    }
  }
}
