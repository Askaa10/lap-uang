import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './auth.dto';
// Add the following import or define the type if it exists elsewhere

@Injectable()
export class AuthService {
  constructor(private Ps: PrismaService) {}

  async login(userLogin: LoginDto) {
    const user = await this.Ps.admin.findUnique({
      where: {
        email: userLogin.email,
      },
    });

    if (!user || !(await bcrypt.compare(userLogin.password, user.password))) {
      throw new UnauthorizedException('Email atau password salah');
    }

    return {
      user: {
        email: user.email,
        name: user.name,
      },
    };
  }

  async myProfile(id: string) {
    const user = await this.Ps.admin.findFirst({
      where: {
        id: id,
      
      },
      select:{
        id: true,
        email: true,
        name: true
      }
    });
    return user;
  }
}
