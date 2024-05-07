import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { GetAllDto } from 'src/core/page/get-all.dto';

export class GetAllObjectsDto extends GetAllDto {
  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  categoryId: number;
  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  cityId: number;
}
