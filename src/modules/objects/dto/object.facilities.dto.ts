import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ObjectFacilitiesDto {
  @ApiProperty()
  @IsNumber({}, { each: true })
  readonly items: number[];
}
