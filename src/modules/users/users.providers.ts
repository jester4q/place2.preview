import { UserGroupEntity } from './entities/user-group.entity';
import { UserEntity } from './entities/user.entity';

export const usersProviders = [
  {
    provide: 'USERS_REPOSITORY',
    useValue: UserEntity,
  },
  {
    provide: 'USERS_GROUPS_REPOSITORY',
    useValue: UserGroupEntity,
  },
];
