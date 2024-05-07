import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddCityDto {
  @ApiProperty()
  @IsString()
  readonly name: string;
  @ApiProperty()
  @IsString()
  readonly url: string;
}
