import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './app/prisma/prisma.module';
import { AuthModule } from './app/auth/auth.module';
import { MailModule } from './app/mail/mail.module';
import { SchoolProfileModule } from './app/school-profile/school-profile.module';
import { StudentModule } from './app/student/student.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    MailModule,
    SchoolProfileModule,
    StudentModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
