import { Injectable, Inject } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { UserGroupEntity, UserRoleEnum } from './entities/user-group.entity';

type User = {
  email: string;
  name: string;
  phone: string;
  password: string;
  dob?: string;
  sendMsgByEmail?: boolean;
  sendDiscountMsg?: boolean;
};

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_REPOSITORY')
    private readonly userRepository: typeof UserEntity,
    @Inject('USERS_GROUPS_REPOSITORY')
    private readonly groupRepository: typeof UserGroupEntity,
  ) {}

  async create(user: User): Promise<UserEntity> {
    const item = await this.userRepository.create(user);

    return item;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const item = await this.userRepository.findOne({
      where: { email },
      include: { model: UserGroupEntity },
    });
    return item;
  }

  async findByPhone(phone: string): Promise<UserEntity | null> {
    const item = await this.userRepository.findOne({ where: { phone } });
    return item;
  }

  async findById(id: number): Promise<UserEntity> {
    const item = await this.userRepository.findOne({ where: { id } });
    return item;
  }

  async findOneById(id: number): Promise<UserEntity> {
    return await this.userRepository.findOne<UserEntity>({ where: { id } });
  }

  async add(user: User) {
    const group = await this.groupRepository.findOne({
      where: { roles: UserRoleEnum.user },
    });

    const item = await this.userRepository.create({
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: user.password,
      dob: user.dob,
      send_discount_msg: user.sendDiscountMsg,
      send_msg_by_email: user.sendMsgByEmail,
      status: 1,
      group_id: (group && group.id) || null,
    });

    return item;
  }

  async update(id: number, user: Partial<User>) {
    const result = await this.userRepository.update(
      {
        name: user.name,
        email: user.email,
        phone: user.phone,
        password: user.password,
        dob: user.dob,
        send_discount_msg: user.sendDiscountMsg,
        send_msg_by_email: user.sendMsgByEmail,
      },
      { where: { id } },
    );
    if (result.length && result[0] > 0) {
      return this.findById(id);
    }

    return null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.userRepository.destroy({ where: { id } });
    return result > 0;
  }

  /*
  async getAll(dto: GetAllUsersDto) {
    return await this.userRepository.findAndCountAll({
      attributes: { exclude: ['password'] },
      include: [{ model: UserGroupEntity, as: 'group' }],
      where: {
        ...(dto.searchString && {
          [Op.or]: [
            { email: { [Op.substring]: dto.searchString } },
            { name: { [Op.substring]: dto.searchString } },
          ],
        }),
      },
      order: [[dto?.sortColumn ?? 'id', dto?.sortType ?? 'ASC']],
      offset: (dto.page - 1) * dto.perPage,
      limit: dto.perPage,
    });
  }
  */
}
