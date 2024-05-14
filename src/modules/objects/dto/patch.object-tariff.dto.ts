import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class PatchObjectTariffDto {
  @ApiPropertyOptional()
  readonly tariffCategoryId?: number;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly title?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly text?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly price?: number;
  @ApiPropertyOptional()
  @IsNumber({}, { each: true })
  readonly facilitiesIds?: number[];
}
