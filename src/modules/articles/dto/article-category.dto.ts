import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ArticleCategoryDto {
  @ApiProperty()
  readonly id?: number;
  @ApiProperty()
  readonly name: string;
  @ApiProperty()
  readonly url: string;
}
