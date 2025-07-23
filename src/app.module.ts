import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './app/prisma/prisma.module';
import { AuthModule } from './app/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { SiswaModule } from './app/siswa/siswa.module';
import { SchoolModule } from './app/school/school.module';
import { SchoolFeeModule } from './app/school-fee/school-fee.module';

@Module({
  imports: [PrismaModule, AuthModule, SiswaModule, SchoolModule, SchoolFeeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
