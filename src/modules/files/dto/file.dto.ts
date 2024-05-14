import { ApiProperty } from '@nestjs/swagger';

export class FileDto {
  @ApiProperty()
  readonly id?: number;
  @ApiProperty()
  readonly name: string;
  @ApiProperty()
  readonly uid?: string;
  @ApiProperty()
  readonly type: string;
  @ApiProperty()
  readonly size?: number;
}
