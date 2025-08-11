import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ArrearService } from './arrear.service';
import { CreateArrearDto, UpdateArrearDto } from './arrear.dto';

@Controller('arrears')
export class ArrearController {
  constructor(private readonly arrearService: ArrearService) {}

  @Post('tambah')
  create(@Body() dto: CreateArrearDto) {
    return this.arrearService.create(dto);
  }

  @Get('all')
  findAll() {
    return this.arrearService.findAll();
  }

  @Get('detail/:id')
  findOne(@Param('id') id: string) {
    return this.arrearService.findOne(id);
  }

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() dto: UpdateArrearDto) {
    return this.arrearService.update(id, dto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.arrearService.remove(id);
  }
}
