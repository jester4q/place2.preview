import {
  BadRequestException,
  NotFoundException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ObjectsService } from './objects.service';
import { GetAllObjectsDto } from './dto/get-all-objects.dto';
import { ListingPage } from 'src/core/page/types';
import { ObjectDto } from './dto/object.dto';
import { AddObjectDto } from './dto/add.object.dto';
import { ObjectsCategoriesService } from './objects-categories.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PatchObjectDto } from './dto/patch.object.dto';
import { CitiesService } from '../cities/cities.service';
import { AuthGuard } from '@nestjs/passport';
import { UserRolesGuard } from '../users/roles/roles.guard';
import { HasRoles } from '../users/roles/roles.decorator';
import { UserRoleEnum } from '../users/entities/user-group.entity';

@ApiTags('Objects')
@Controller('/objects')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), UserRolesGuard)
export class ObjectsController {
  constructor(
    private readonly objectsService: ObjectsService,
    private readonly categoriesService: ObjectsCategoriesService,
    private readonly citiesService: CitiesService,
  ) {}

  @Get('/')
  async getAll(
    @Query() dto: GetAllObjectsDto,
  ): Promise<ListingPage<ObjectDto>> {
    if (dto.sortColumn) {
      const sort = dto.sortColumn;
      if (!['name', 'id', 'rating'].includes(sort)) {
        throw new BadRequestException('Sort column is not valid');
      }
    }

    const list = await this.objectsService.getAll(dto);
    return { ...list, items: list.items.map((item) => item.toDto()) };
  }

  @Get('/:url')
  async getByUrl(@Param('url') url: string): Promise<ObjectDto> {
    let object;
    if (url && (object = await this.objectsService.findOneByUrl(url))) {
      return object.toDto();
    }

    throw new NotFoundException('Could not find object by url: ' + url);
  }

  @Post('/')
  @HasRoles(UserRoleEnum.admin)
  async add(@Body() dto: AddObjectDto): Promise<ObjectDto> {
    await this.checkCategory(dto.categoryId);
    await this.checkCity(dto.cityId);
    const item = await this.objectsService.add(dto);
    return item.toDto();
  }

  @Patch('/:id')
  @HasRoles(UserRoleEnum.admin)
  async patch(@Param('id') id: number, @Body() dto: PatchObjectDto) {
    if (dto.categoryId !== undefined) {
      await this.checkCategory(dto.categoryId);
    }
    if (dto.cityId !== undefined) {
      await this.checkCity(dto.cityId);
    }
    let object;
    if (id > 0 && (object = await this.objectsService.update(id, dto))) {
      return object.toDto();
    }

    throw new NotFoundException('Could not find object by id: ' + id);
  }

  @Delete('/:id')
  @HasRoles(UserRoleEnum.admin)
  async delete(@Param('id') id: number): Promise<any> {
    if (id > 0 && (await this.objectsService.delete(id))) {
      return {};
    }

    throw new NotFoundException('Could not find object by id: ' + id);
  }

  private async checkCategory(categoryId: number) {
    if (!categoryId) {
      throw new NotFoundException(
        'Could not find category by id: ' + categoryId,
      );
    }
    const category = await this.categoriesService.findOneById(categoryId);
    if (!category) {
      throw new NotFoundException(
        'Could not find category by id: ' + categoryId,
      );
    }
  }

  private async checkCity(cityId: number) {
    if (!cityId) {
      throw new NotFoundException('Could not find city by id: ' + cityId);
    }
    const city = await this.citiesService.findOneById(cityId);
    if (!city) {
      throw new NotFoundException('Could not find city by id: ' + cityId);
    }
  }
}
