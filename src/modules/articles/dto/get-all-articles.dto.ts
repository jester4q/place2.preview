import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { GetAllDto } from 'src/core/page/get-all.dto';

export class GetAllArticlesDto extends GetAllDto {
  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  categoryId: number;
}
