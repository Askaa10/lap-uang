import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { SchoolProfileService } from './school-profile.service';
import { CreateSchoolProfileDto, UpdateSchoolProfileDto } from './school-profile.dto';


@Controller('school-profile')
export class SchoolProfileController {
  constructor(private readonly service: SchoolProfileService) {}

  @Post('tambah')
  create(@Body() dto: CreateSchoolProfileDto) {
    return this.service.create(dto);
  }

  @Get('all')
  findAll() {
    return this.service.findAll();
  }

  @Get('detail/:id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() dto: UpdateSchoolProfileDto) {
    return this.service.update(id, dto);
  }

  @Delete('remove/:id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Get('my-profile/:id')
  myProfile(@Param('id') id: string) {
    return this.service.myProfile(id);
  }
}
