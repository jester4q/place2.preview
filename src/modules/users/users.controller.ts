import {
  Controller,
  Get,
  Param,
  UseGuards,
  Post,
  Body,
  Patch,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { SessionUser } from '../auth/sessionUser.decorator';
import { UserDto } from './dto/user.dto';
import { UserRoleEnum } from './entities/user-group.entity';
import { HasRoles } from './roles/roles.decorator';
import { UserRolesGuard } from './roles/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
//import { ClientNats } from '@nestjs/microservices';
//import { ElasticsearchLoggerService } from '@nestjs.pro/logger-elasticsearch/dist/ElasticsearchLoggerService';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), UserRolesGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService, //@Inject('ELASTIC_LOGGER') //private elasticsearchLoggerService: ElasticsearchLoggerService, //@Inject('NATS') private clientNotifications: ClientNats,
  ) {}

  @HasRoles(UserRoleEnum.admin)
  @Get('/:id')
  async getUser(@Param('id') id: number) {
    const item = await this.usersService.findById(id);
    return item.toDto();
  }

  @Get('/')
  async getProfile(@SessionUser() session: UserDto) {
    console.log(session);
    const item = await this.usersService.findById(session.id);
    return item.toDto();
  }

  @Post('/')
  async add(@Body() dto: CreateUserDto) {
    const item = await this.usersService.add(dto);
    return item.toDto();
  }

  @Patch('/:id')
  @HasRoles(UserRoleEnum.admin)
  async patch(@Param('id') id: number, @Body() dto: UpdateUserDto) {
    let user;
    if (id > 0 && (user = await this.usersService.update(id, dto))) {
      return user.toDto();
    }

    throw new NotFoundException('Could not find user by id: ' + id);
  }

  @Delete('/:id')
  @HasRoles(UserRoleEnum.admin)
  async delete(@Param('id') id: number): Promise<any> {
    if (id > 0 && (await this.usersService.delete(id))) {
      return {};
    }

    throw new NotFoundException('Could not find tariff by id: ' + id);
  }
}
