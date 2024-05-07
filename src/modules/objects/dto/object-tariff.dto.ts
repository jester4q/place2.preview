import { ApiProperty } from '@nestjs/swagger';
import { FacilityDto } from './facility.dto';

export class ObjectTariffDto {
  @ApiProperty()
  readonly id?: number;
  @ApiProperty()
  objectId: number;
  @ApiProperty()
  tariffCategoryId: number;
  @ApiProperty()
  readonly title: string;
  @ApiProperty()
  readonly text?: string;
  @ApiProperty()
  readonly rating: number;
  @ApiProperty()
  readonly price: number;
  @ApiProperty()
  readonly facilities?: FacilityDto[];
}
