import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Patch,
  Delete,
} from '@nestjs/common';
import { ObjectsService } from './objects.service';
import { GetAllObjectsDto } from './dto/get-all-objects.dto';
import { ListingPage } from 'src/core/page/types';
import { ObjectDto } from './dto/object.dto';
import { AddObjectDto } from './dto/add.object.dto';
import { ObjectsCategoriesService } from './objects-categories.service';
import { ApiTags } from '@nestjs/swagger';
import { PatchObjectDto } from './dto/patch.object.dto';
import { CitiesService } from '../cities/cities.service';

@ApiTags('Objects')
@Controller('/objects')
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
    return list;
  }

  @Get('/:url')
  async getByUrl(@Param('url') url: string): Promise<ObjectDto> {
    let object;
    if (url && (object = await this.objectsService.findOneByUrl(url))) {
      return object;
    }

    throw new BadRequestException('Could not find object by url: ' + url);
  }

  @Post('/')
  async add(@Body() dto: AddObjectDto): Promise<ObjectDto> {
    await this.checkCategory(dto.categoryId);
    await this.checkCity(dto.cityId);
    return this.objectsService.add(dto);
  }

  @Patch('/:id')
  async patch(@Param('id') id: number, @Body() dto: PatchObjectDto) {
    if (dto.categoryId !== undefined) {
      await this.checkCategory(dto.categoryId);
    }
    if (dto.cityId !== undefined) {
      await this.checkCity(dto.cityId);
    }
    let object;
    if (id > 0 && (object = await this.objectsService.update(id, dto))) {
      return object;
    }

    throw new BadRequestException('Could not find object by id: ' + id);
  }

  @Delete('/:id')
  async delete(@Param('id') id: number): Promise<any> {
    if (id > 0 && (await this.objectsService.delete(id))) {
      return {};
    }

    throw new BadRequestException('Could not find object by id: ' + id);
  }

  private async checkCategory(categoryId: number) {
    if (!categoryId) {
      throw new BadRequestException(
        'Could not find category by id: ' + categoryId,
      );
    }
    const category = await this.categoriesService.findOneById(categoryId);
    if (!category) {
      throw new BadRequestException(
        'Could not find category by id: ' + categoryId,
      );
    }
  }

  private async checkCity(cityId: number) {
    if (!cityId) {
      throw new BadRequestException('Could not find city by id: ' + cityId);
    }
    const city = await this.citiesService.findOneById(cityId);
    if (!city) {
      throw new BadRequestException('Could not find city by id: ' + cityId);
    }
  }
}
