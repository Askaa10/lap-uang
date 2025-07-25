import { Module } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { StatisticController } from './statistic.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [StatisticService, PrismaService],
  controllers: [StatisticController]
})
export class StatisticModule {}
