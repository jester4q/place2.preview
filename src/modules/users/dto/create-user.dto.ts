import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Validate } from 'class-validator';
import { IsDate } from '../../../core/validators/date.validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  readonly email: string;

  @ApiProperty()
  @IsString()
  readonly phone: string;

  @ApiProperty()
  @IsString()
  readonly name: string;

  @ApiProperty()
  @IsString()
  readonly password: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Validate(IsDate)
  readonly dob: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  readonly sendMsgByEmail: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  readonly sendDiscountMsg: boolean;
}
