import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';

export class CreateFeeGroupDto {
  @IsString()
  name: string;

  @IsString()
  academicYear: string;

  @IsString()
  level: string;
}
export class UpdateFeeGroupDto extends PartialType(CreateFeeGroupDto) {}