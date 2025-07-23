import { Module } from '@nestjs/common';
import { SiswaService } from './siswa.service';
import { SiswaController } from './siswa.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [SiswaService, PrismaService],
  controllers: [SiswaController]
})
export class SiswaModule {}
