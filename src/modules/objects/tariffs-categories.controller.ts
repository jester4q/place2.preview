import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ObjectsCategoriesService } from './objects-categories.service';
import { TariffsCategoriesService } from './tariffs-categories.service';
import { AddTariffCategoryDto } from './dto/add.tariff-category.dto';
import { PatchTariffCategoryDto } from './dto/patch.tariff-category.dto';

@ApiTags('Tariff categories')
@Controller('/objects/categories/:categoryId/tariffs-categories')
export class TariffsCategoriesController {
  constructor(
    private readonly tariffsCategoriesService: TariffsCategoriesService,
    private readonly categoriesService: ObjectsCategoriesService,
  ) {}

  @Get('/')
  async getAll(@Param('categoryId') categoryId: number) {
    await this.checkCategory(categoryId);
    return this.tariffsCategoriesService.getAll(categoryId);
  }

  @Get('/:id')
  async getById(
    @Param('categoryId') categoryId: number,
    @Param('id') id: number,
  ) {
    //await this.checkCategory(categoryId);
    let cat;
    if (id > 0 && (cat = await this.tariffsCategoriesService.findOneById(id))) {
      return cat;
    }

    throw new BadRequestException(
      'Could not find tariff category by id: ' + id,
    );
  }

  @Post('/')
  async add(
    @Param('categoryId') categoryId: number,
    @Body() dto: AddTariffCategoryDto,
  ) {
    await this.checkCategory(categoryId);
    return this.tariffsCategoriesService.add(categoryId, dto);
  }

  @Patch('/:id')
  async patch(
    @Param('categoryId') categoryId: number,
    @Param('id') id: number,
    @Body() dto: PatchTariffCategoryDto,
  ) {
    //await this.checkCategory(categoryId);
    let cat;
    if (id > 0 && (cat = await this.tariffsCategoriesService.update(id, dto))) {
      return cat;
    }

    throw new BadRequestException(
      'Could not find tariff category by id: ' + id,
    );
  }

  @Delete('/:id')
  async delete(@Param('id') id: number): Promise<any> {
    if (id > 0 && (await this.tariffsCategoriesService.delete(id))) {
      return {};
    }

    throw new BadRequestException(
      'Could not find tariff category by id: ' + id,
    );
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
}
