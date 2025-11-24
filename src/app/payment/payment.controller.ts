import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto, UpdatePaymentDto } from './payment.dto';
import { PaymentTypeService } from './payment-type/payment-type.service';
@Controller('payments')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly paymentTypeService: PaymentTypeService,
  ) {}

  @Post('tambah')
  create(@Body() dto: CreatePaymentDto) {
    return this.paymentService.create(dto);
  }
  @Get('cicilan/:typeId')
  async getMergedPayments(
    @Param('typeId') typeId: string,
  ) {
    return this.paymentService.getGroupedPaymentsByStudent(typeId);
  }

  // @Get("/list/payment/siswa/done/:id")
  // async getListPaymentDone(@Param("id") id:string) {
  //   return await this.paymentService.getListPaymentSuccessByStudent(id)
  //   }

  @Post('Bulk')
  createBulk(@Body() dtos: CreatePaymentDto[]) {
    return this.paymentService.createBulk(dtos);
  }

  @Get('semua')
  findAll() {
    return this.paymentService.findAll();
  }

  @Get('rekap/:year')
  rekap(@Param('year') year: number) {
    return this.paymentService.rekapBulanan(Number(year));
  }
  @Get('/category/:name')
  async findByCategory(@Param('name') name: string) {
    return await this.paymentService.paymentsByCategory(name);
  }

  @Get('detail/:id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(id);
  }

  @Patch('update/:studentId/:year/:type')
  async updatePayment(
    @Param('studentId') studentId: string,
    @Param('year') year: number,
    @Param('type') typeId: string,
    @Body()
    updateDto: {
      amount?: number; // nominal baru
      status?: 'LUNAS' | 'BELUM LUNAS'; // status bayar
    },
  ) {
    return this.paymentService.updatePayment(
      studentId,
      typeId,
      Number(year),
      updateDto,
    );
  }

  @Get("tagihan/sakusaku/:NISN/:code")
  async getTagihanSakuSaku(@Param('NISN') NISN: string, @Param("code") code:string) {
    return await this.paymentService.getTagihanSakuSaku(NISN,code )
  }

  @Get('/filter/:ids/:idc')
  async getPaymentsByCNS(@Param('ids') ids: string, @Param('idc') idc: string) {
    return this.paymentService.getPaymentsByCNS(ids, idc);
  }
  @Get('tagihan/:nisn')
  getTagihan(@Param('nisn') nisn: string) {
    return this.paymentService.getTagihanByNisn(nisn);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(id);
  }
}
