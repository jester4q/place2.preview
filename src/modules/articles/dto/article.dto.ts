import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ArticleDto {
  @ApiProperty()
  readonly id?: number;
  @ApiProperty()
  readonly title: string;
  @ApiProperty()
  readonly url: string;
  @ApiPropertyOptional({ default: 0 })
  readonly readingTime: number;
  @ApiPropertyOptional({ default: 0 })
  readonly categoryId: number;
  @ApiPropertyOptional({ default: '' })
  readonly text: string;
  @ApiPropertyOptional({ default: 0 })
  readonly imageId: number;
}
