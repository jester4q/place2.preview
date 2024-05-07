import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EventDto {
  @ApiProperty()
  readonly id?: number;
  @ApiProperty()
  readonly title: string;
  @ApiProperty()
  readonly url: string;
  @ApiPropertyOptional({ default: '' })
  readonly sponsor: string;
  @ApiPropertyOptional({ default: 0 })
  readonly categoryId: number;
  @ApiPropertyOptional({ default: '' })
  readonly text: string;
  @ApiPropertyOptional({ default: 0 })
  readonly imageId: number;
  @ApiPropertyOptional({ default: 0 })
  readonly objectId: number;
  @ApiPropertyOptional({ default: '' })
  readonly address: string;
  @ApiPropertyOptional({ default: 0 })
  readonly price: number;
  @ApiPropertyOptional({ default: null })
  readonly startDate: string;
  @ApiPropertyOptional({ default: null })
  readonly endDate: string;
}
