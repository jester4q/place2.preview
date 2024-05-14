import { ApiProperty } from '@nestjs/swagger';

export class GetAllUsersDto {
  @ApiProperty({ default: 1 })
  page: number;

  @ApiProperty({ default: 25 })
  perPage: number;

  @ApiProperty({ nullable: true, default: null })
  sortColumn?: string;

  @ApiProperty({ nullable: true, default: null })
  sortType?: string;

  @ApiProperty({ nullable: true, default: null })
  searchString?: string;
}
