import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  ParseBoolPipe,
} from '@nestjs/common';
import { SubCategoryService } from './sub-category.service';
import { CreateSubCategoryDto, UpdateSubCategoryDto } from './sub-category.dto';

@Controller('subcategory')
export class SubCategoryController {
  constructor(private readonly service: SubCategoryService) {}

  /**
   * ✅ GET /subcategory
   * Ambil semua subcategory (bisa pakai ?search=...&category_id=...)
   */
  @Get()
  async getAll(@Query() query: any) {
    return this.service.getAll(query);
  }

  /**
   * ✅ GET /subcategory/:id
   * Ambil detail subcategory by ID
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  /**
   * ✅ POST /subcategory
   * Buat subcategory baru
   */
  @Post()
  async create(@Body() dto: CreateSubCategoryDto) {
    return this.service.create(dto);
  }

  /**
   * ✅ PATCH /subcategory/:id
   * Update data subcategory
   */
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSubCategoryDto,
  ) {
    return this.service.update(id, dto);
  }

  /**
   * ✅ PATCH /subcategory/:id/isdelete?isDelete=true
   * Soft delete atau restore subcategory
   */
  @Patch(':id/isdelete')
  async updateIsDelete(
    @Param('id', ParseIntPipe) id: number,
    @Query('isDelete', ParseBoolPipe) isDelete: boolean,
  ) {
    return this.service.updateIsDelete(id, isDelete);
  }

  /**
   * ❌ DELETE /subcategory/:id
   * Hapus permanen subcategory
   */
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}
