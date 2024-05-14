import { Table, Column, Model, DataType } from 'sequelize-typescript';

export enum UserRoleEnum {
  none = 'none',
  admin = 'admin',
  user = 'user',
}

@Table({ tableName: 'users_groups' })
export class UserGroupEntity extends Model<UserGroupEntity> {
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.ENUM(...Object.values(UserRoleEnum)),
    allowNull: false,
  })
  roles: UserRoleEnum;
}
