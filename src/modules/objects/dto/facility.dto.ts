import { ApiProperty } from '@nestjs/swagger';

export class FacilityDto {
  @ApiProperty()
  readonly id?: number;
  @ApiProperty()
  readonly name: string;
  @ApiProperty()
  readonly icon: string;
  @ApiProperty()
  readonly categoryId: number;
}
