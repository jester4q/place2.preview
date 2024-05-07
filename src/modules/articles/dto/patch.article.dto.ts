import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class PatchArticleDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly title?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly url?: string;
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  readonly readingTime: number;
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  readonly categoryId: number;
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly text: string;
}
