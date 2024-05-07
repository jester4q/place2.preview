import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class PatchObjectReviewDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly text: string;
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  readonly rating: number;
}
