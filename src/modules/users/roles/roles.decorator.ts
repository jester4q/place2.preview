import { SetMetadata } from '@nestjs/common';
import { UserRoleEnum } from '../entities/user-group.entity';

export const HasRoles = (...roles: UserRoleEnum[]) =>
  SetMetadata('roles', roles);
