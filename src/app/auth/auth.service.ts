import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

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
}
