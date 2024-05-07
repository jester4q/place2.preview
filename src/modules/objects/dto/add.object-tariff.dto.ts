import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddObjectTariffDto {
  @ApiProperty()
  readonly tariffCategoryId: number;
  @ApiProperty()
  readonly title: string;
  @ApiPropertyOptional()
  readonly text?: string;
  @ApiPropertyOptional()
  readonly price?: number;
}
