import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CitiesService } from './cities.service';
import { AddCityDto } from './dto/add.city.dto';
import { PatchCityDto } from './dto/patch.city.dto';
import { UserRolesGuard } from '../users/roles/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { HasRoles } from '../users/roles/roles.decorator';
import { UserRoleEnum } from '../users/entities/user-group.entity';

@ApiTags('Cities')
@Controller('cities')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), UserRolesGuard)
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Get('/')
  getAll() {
    return this.citiesService.getAll();
  }

  @Get('/:url')
  async getByUrl(@Param('url') url: string) {
    let city;
    if (url && (city = await this.citiesService.findOneByUrl(url))) {
      return city.toDto();
    }

    throw new NotFoundException('Could not find city by url: ' + url);
  }

  @Post('/')
  @HasRoles(UserRoleEnum.admin)
  async add(@Body() dto: AddCityDto) {
    const item = await this.citiesService.add(dto);
    return item.toDto();
  }

  @Patch('/:id')
  @HasRoles(UserRoleEnum.admin)
  async patch(@Param('id') id: number, @Body() dto: PatchCityDto) {
    let city;
    if (id > 0 && (city = await this.citiesService.update(id, dto))) {
      return city.toDto();
    }

    throw new NotFoundException('Could not find city by id: ' + id);
  }
}
