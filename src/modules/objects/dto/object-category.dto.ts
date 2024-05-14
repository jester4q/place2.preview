import { ApiProperty } from '@nestjs/swagger';

export class ObjectCategoryDto {
  @ApiProperty()
  readonly id?: number;
  @ApiProperty()
  readonly name: string;
  @ApiProperty()
  readonly url: string;
  @ApiProperty()
  readonly parentId: number;
  @ApiProperty()
  readonly children?: ObjectCategoryDto[];
}
