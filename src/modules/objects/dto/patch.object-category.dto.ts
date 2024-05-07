import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class PatchObjectCategoryDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly url: string;

  @ApiProperty({ default: 0 })
  @IsNumber()
  @IsOptional()
  readonly parentId: number;
}
