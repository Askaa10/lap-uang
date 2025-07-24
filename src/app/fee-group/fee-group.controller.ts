import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { FeeGroupService } from './fee-group.service';
import { CreateFeeGroupDto, UpdateFeeGroupDto } from './fee-group.dto';


@Controller('fee-group')
export class FeeGroupController {
  constructor(private readonly service: FeeGroupService) {}

  @Post('create')
  create(@Body() dto: CreateFeeGroupDto) {
    return this.service.create(dto);
  }

  @Get('all')
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFeeGroupDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
