import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './app/prisma/prisma.module';
import { AuthModule } from './app/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { SiswaModule } from './app/siswa/siswa.module';

@Module({
  imports: [PrismaModule, AuthModule, SiswaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
