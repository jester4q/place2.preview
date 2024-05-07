import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Validate } from 'class-validator';
import { IsDate } from '../../../core/validators/date.validator';

export class AddEventDto {
  @ApiProperty()
  @IsString()
  readonly title: string;
  @ApiProperty()
  @IsString()
  readonly url: string;
  @ApiProperty()
  @IsNumber()
  readonly categoryId: number;
  @ApiPropertyOptional({ default: '' })
  @IsOptional()
  @IsString()
  readonly sponsor: string;
  @ApiPropertyOptional({ default: '' })
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
