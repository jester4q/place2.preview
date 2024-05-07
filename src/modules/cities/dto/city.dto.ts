import { ApiProperty } from '@nestjs/swagger';

export class CityDto {
  @ApiProperty()
  readonly id?: number;
  @ApiProperty()
  readonly name: string;
  @ApiProperty()
  readonly url: string;
}
