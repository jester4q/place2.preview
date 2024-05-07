import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class AddArticleDto {
  @ApiProperty()
  @IsString()
  readonly title: string;
  @ApiProperty()
  @IsString()
  readonly url: string;
  @ApiProperty()
  @IsNumber()
  readonly categoryId: number;
  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsNumber()
  readonly readingTime: number;
  @ApiPropertyOptional({ default: '' })
  @IsOptional()
  @IsString()
  readonly text: string;
}
