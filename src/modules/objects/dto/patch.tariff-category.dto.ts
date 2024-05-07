import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class PatchTariffCategoryDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly name: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly url: string;
}
