import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class AddObjectCategoryDto {
  @ApiProperty()
  @IsString()
  readonly name: string;
  @ApiProperty()
  @IsString()
  readonly url: string;
  @ApiProperty({ default: 0 })
  @IsNumber()
  @IsOptional()
  readonly parentId: number;
}
