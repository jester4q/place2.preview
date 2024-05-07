import {
  IsString,
  IsOptional,
  IsNumber,
  Matches,
  IsEmail,
  IsUrl,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PatchObjectDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly url: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly text: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  readonly categoryId: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  readonly cityId: number;

  @ApiPropertyOptional()
  @Matches(/^([0-2]?[0-9]):([0-5]?[0-9])$/)
  @IsOptional()
  readonly workTimeStart: string;

  @ApiPropertyOptional()
  @Matches(/^([0-2]?[0-9]):([0-5]?[0-9])$/)
  @IsOptional()
  readonly workTimeEnd: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly address: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  readonly latitude: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  readonly longitude: number;

  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  readonly email: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly phone: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @IsUrl()
  readonly site: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly linkVk: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly linkTg: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly linkYoutube: string;
}
