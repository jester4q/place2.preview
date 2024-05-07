import { ApiProperty } from '@nestjs/swagger';

export class ObjectReviewDto {
  @ApiProperty()
  readonly id?: number;
  @ApiProperty()
  objectId: number;
  @ApiProperty()
  userId: number;
  @ApiProperty()
  readonly text: string;
  @ApiProperty()
  readonly rating: number;
}
