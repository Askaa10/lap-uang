import { Module } from '@nestjs/common';
import { SchoolService } from './school.service';
import { SchoolController } from './school.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [SchoolService, PrismaService],
  controllers: [SchoolController]
})
export class SchoolModule {}
