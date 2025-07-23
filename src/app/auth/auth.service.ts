import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from './auth.dto';



@Injectable()
export class AuthService {
  constructor(
    private Ps: PrismaService,
    private jwtService: JwtService,
  ) {}

  generateJWT(payload: jwtPayload, expiresIn: string | number, token: string) {
    return this.jwtService.sign(payload, {
      secret: token,
      expiresIn: expiresIn,
    });
    }
    
  async login(userLogin: LoginDTO) {
    const user = await this.Ps.admin.findUnique({
      where: {
        email: userLogin.email,
      },
    });
    if (!user || !(await bcrypt.compare(userLogin.password, user.password))) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      }
    };
  }

  async getUser() {
    const user = await this.Ps.admin.findMany({
      
    })
  }
}

