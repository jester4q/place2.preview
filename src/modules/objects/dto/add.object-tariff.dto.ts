import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class AddObjectTariffDto {
  @ApiProperty()
  readonly tariffCategoryId: number;
  @ApiProperty()
  readonly title: string;
  @ApiPropertyOptional()
  readonly text?: string;
  @ApiPropertyOptional()
  readonly price?: number;
  @ApiPropertyOptional()
  @IsNumber({}, { each: true })
  readonly facilitiesIds?: number[];
}
