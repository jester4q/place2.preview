import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  BeforeCreate,
  BeforeUpdate,
  Default,
} from 'sequelize-typescript';
import { UserGroupEntity } from './user-group.entity';
import * as bcrypt from 'bcrypt';
import { UserDto } from '../dto/user.dto';

@Table({ tableName: 'users' })
export class UserEntity extends Model<UserEntity> {
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @BelongsTo(() => UserGroupEntity, 'group_id')
  group: UserGroupEntity;

  @Column({
    type: DataType.INTEGER,
  })
  group_id: number;

  @Column({
    type: DataType.STRING,
  })
  name: string;

  @Column({
    type: DataType.STRING,
  })
  phone: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  dob: string;

  @Column({
    type: DataType.INTEGER,
  })
  status: number;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  send_msg_by_email: boolean;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  send_discount_msg: boolean;

  toDto(): UserDto {
    return {
      id: this.id,
      groupId: this.group_id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      status: this.status,
      dob: this.dob,
      sendDiscountMsg: this.send_discount_msg,
      sendMsgByEmail: this.send_msg_by_email,
      roles: (this.group && this.group.roles) || undefined,
    };
  }

  async checkPassword(enteredPassword: string) {
    const match = await bcrypt.compare(enteredPassword, this.password);
    return match;
  }

  @BeforeCreate
  @BeforeUpdate
  static async setPassword(user: UserEntity) {
    const value = user.password;
    if (user.changed('password')) {
      user.password = await UserEntity.hashPassword(value);
    }
  }

  static async hashPassword(pwd: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(pwd, salt);
  }
}
