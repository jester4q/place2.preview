import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Validate } from 'class-validator';
import { IsDate } from '../../../core/validators/date.validator';

export class PatchEventDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly title?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly url?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly sponsor: string;
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  readonly categoryId: number;
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly text: string;
  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsNumber()
  readonly objectId: number;
  @ApiPropertyOptional({ default: '' })
  @IsOptional()
  @IsString()
  readonly address: string;
  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsNumber()
  readonly price: number;
  @ApiPropertyOptional({ default: null })
  @IsOptional()
  @Validate(IsDate)
  readonly startDate: string;
  @ApiPropertyOptional({ default: null })
  @IsOptional()
  @Validate(IsDate)
  readonly endDate: string;
}
