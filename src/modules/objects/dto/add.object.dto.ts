import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  Matches,
  IsEmail,
  IsUrl,
} from 'class-validator';

export class AddObjectDto {
  @ApiProperty()
  @IsString()
  readonly url: string;

  @ApiProperty()
  @IsString()
  readonly name: string;

  @ApiPropertyOptional()
  @IsString()
  readonly text?: string;

  @ApiProperty()
  @IsNumber()
  readonly categoryId: number;

  @ApiProperty()
  @IsNumber()
  readonly cityId: number;

  @ApiPropertyOptional()
  @Matches(/^([0-2]?[0-9]):([0-5]?[0-9])$/)
  @IsOptional()
  readonly workTimeStart?: string;

  @ApiPropertyOptional()
  @Matches(/^([0-2]?[0-9]):([0-5]?[0-9])$/)
  @IsOptional()
  readonly workTimeEnd?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly address?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  readonly latitude?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  readonly longitude?: number;

  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  readonly email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  readonly phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  readonly site?: string;

  @ApiPropertyOptional()
  @IsOptional()
  readonly linkVk?: string;

  @ApiPropertyOptional()
  readonly linkTg?: string;

  @ApiPropertyOptional()
  @IsOptional()
  readonly linkYoutube?: string;
}
