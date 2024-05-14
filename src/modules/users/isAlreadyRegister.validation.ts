import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { ApiContextAwareDto } from '../context-aware.dto';

@Injectable()
@ValidatorConstraint({ name: 'isAlreadyRegister', async: true })
export class IsAlreadyRegisterValidation
  implements ValidatorConstraintInterface
{
  constructor(private readonly userService: UsersService) {}

  async validate(value: string, args: ValidationArguments) {
    const { object, property } = args;
    const dto: { email?: string; phone?: string; id?: number } =
      object as unknown;
    dto.id = (object as ApiContextAwareDto).context?.id || 0;

    let userExist: UserEntity = null;

    if (property === 'email') {
      userExist = await this.userService.findByEmail(value);
    }

    if (property === 'phone') {
      userExist = await this.userService.findByPhone(value);
    }

    return !userExist || (dto.id > 0 && dto.id == userExist.id);
  }

  defaultMessage(): string {
    return 'User with $property «$value» is already registered';
  }
}

export function IsAlreadyRegister(options: ValidationOptions = {}) {
  return function (object: object, propertyName: 'email' | 'fingerprint') {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      validator: IsAlreadyRegisterValidation,
    });
  };
}
