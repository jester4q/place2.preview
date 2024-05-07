import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class PatchArticleCategoryDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly name: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly url: string;
}
