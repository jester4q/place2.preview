import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class AddObjectReviewDto {
  @ApiProperty()
  @IsNumber()
  readonly userId: number;
  @ApiProperty()
  @IsString()
  readonly text: string;
  @ApiProperty()
  @IsNumber()
  readonly rating: number;
}
