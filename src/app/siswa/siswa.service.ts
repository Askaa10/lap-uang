import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SiswaService {
    constructor(private Ps: PrismaService) { }
    

    
}
