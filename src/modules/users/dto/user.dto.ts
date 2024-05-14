import { UserRoleEnum } from '../entities/user-group.entity';

export class UserDto {
  readonly id?: number;
  readonly email: string;
  readonly groupId: number;
  readonly name?: string;
  readonly phone?: string;
  readonly status?: number;
  readonly roles?: UserRoleEnum;
  readonly dob?: string;
  readonly sendDiscountMsg?: boolean;
  readonly sendMsgByEmail?: boolean;
}
