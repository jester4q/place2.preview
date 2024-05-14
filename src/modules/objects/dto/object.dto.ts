import { ApiProperty } from '@nestjs/swagger';
import { FacilityDto } from './facility.dto';
import { ObjectTariffDto } from './object-tariff.dto';
import { ObjectReviewDto } from './object-review.dto';

export class ObjectDto {
  @ApiProperty()
  readonly id?: number;

  @ApiProperty()
  readonly url: string;

  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly text: string;

  @ApiProperty()
  readonly totalReviews: number;

  @ApiProperty()
  readonly rating: number;

  @ApiProperty()
  readonly categoryId: number;

  @ApiProperty()
  readonly cityId: number;

  @ApiProperty()
  readonly logoId: number;

  @ApiProperty()
  readonly workTimeStart: string;

  @ApiProperty()
  readonly workTimeEnd: string;

  @ApiProperty()
  readonly address: string;

  @ApiProperty()
  readonly latitude: number;

  @ApiProperty()
  readonly longitude: number;

  @ApiProperty()
  readonly email: string;

  @ApiProperty()
  readonly phone: string;

  @ApiProperty()
  readonly site: string;

  @ApiProperty()
  readonly linkVk: string;

  @ApiProperty()
  readonly linkTg: string;

  @ApiProperty()
  readonly linkYoutube: string;

  @ApiProperty()
  images: number[];

  @ApiProperty()
  facilities: FacilityDto[];

  @ApiProperty()
  tariffs: ObjectTariffDto[];

  @ApiProperty()
  reviews: ObjectReviewDto[];
}
