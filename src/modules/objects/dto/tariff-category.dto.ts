import { ApiProperty } from '@nestjs/swagger';

export class TariffCategoryDto {
  @ApiProperty()
  readonly id?: number;
  @ApiProperty()
  readonly categoryId: number;
  @ApiProperty()
  readonly name: string;
  @ApiProperty()
  readonly url: string;
}
