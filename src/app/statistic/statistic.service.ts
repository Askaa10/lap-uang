import { Injectable } from '@nestjs/common';
import { BaseResponse } from 'src/utils/response/base.response';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatisticService extends BaseResponse {
  constructor(private Ps: PrismaService) {
    super();
  }

  getMonthYearRange(year: number, month: number) {
    const start = new Date(Date.UTC(year, month - 2, 1));
    const end = new Date(Date.UTC(year, month - 1, 1));

    return { start, end };
  }
  getPastMonth(year: number, month: number) {
    const startPast = new Date(Date.UTC(year, month - 3, 1));
    const endPast = new Date(Date.UTC(year, month - 2, 1));
    return { startPast, endPast };
  }

  async getIncome(monthStart: string, monthLast: string) {
    let arr = [];
    let inc: number = 0;
    const income = await this.Ps.studentPayment.findMany({
      where: {
        paymentDate: {
          gte: monthStart,
          lt: monthLast,
        },
      },
      select: {
        amountPaid: true,
      },
    });

    if (income.length > 0) {
      for (let i in income) {
        arr.push(Number(income[i].amountPaid));
      }
      inc = arr.reduce((a, b) => a + b);
    }
    return inc;
  }

  getGrowth(curr: number, prev: number): number {
    if (prev === 0) return curr > 0 ? 100 : 0;
    return ((curr - prev) / Math.abs(prev)) * 100;
  }

  async DashboardStatistic(payload: any) {
    const { month, year } = payload;
    const { start, end } = this.getMonthYearRange(year, month);
    const { startPast, endPast } = this.getPastMonth(year, month);

    const incCurr = await this.getIncome(
      start.toISOString(),
      end.toISOString(),
    );
    const incPrev = await this.getIncome(
      startPast.toISOString(),
      endPast.toISOString(),
    );
    const incGrowth = this.getGrowth(incCurr, incPrev);

    return {
      income: {
        amount: incCurr,
        growth: incGrowth,
        },
        expense: {
            amount: 0,
            growth: 0
        },
        surplus: 0
    };
  }
}
