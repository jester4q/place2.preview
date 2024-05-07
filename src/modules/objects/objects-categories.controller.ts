import {
  BadRequestException,
  Query,
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ObjectsCategoriesService } from './objects-categories.service';
import { ObjectCategoryDto } from './dto/object-category.dto';
import { AddObjectCategoryDto } from './dto/add.object-category.dto';
import { PatchObjectCategoryDto } from './dto/patch.object-category.dto';
import { isNumber } from '../../core/utils';

@Controller('/objects-categories')
@ApiTags('Objects Categories')
export class ObjectsCategoriesController {
  constructor(private readonly categoriesService: ObjectsCategoriesService) {}

  @Get('/')
  @ApiQuery({
    name: 'depth',
    type: Number,
    description: 'Category tree depth (default = -1)',
    required: false,
  })
  async getAll(@Query('depth') depth?: number): Promise<ObjectCategoryDto[]> {
    if (!isNumber(depth)) {
      depth = -1;
    }
    console.log(depth);
    const list = await this.categoriesService.fetchAll(depth);
    return list;
  }

  @Get('/:id')
  @ApiQuery({
    name: 'depth',
    type: Number,
    description: 'Category tree depth (default = -1)',
    required: false,
  })
  async get(
    @Param('id') id: number,
    @Query('depth') depth?: number,
  ): Promise<ObjectCategoryDto> {
    this.checkParentCategory(id);
    if (!isNumber(depth)) {
      depth = -1;
    }
    console.log(depth);
    const tree = await this.categoriesService.fetchTree(id, depth);
    return tree;
  }

  @Post('/')
  async add(@Body() dto: AddObjectCategoryDto) {
    if (dto.parentId) {
      await this.checkParentCategory(dto.parentId);
    }

    return this.categoriesService.add(dto);
  }

  @Patch('/:id')
  async patch(@Param('id') id: number, @Body() dto: PatchObjectCategoryDto) {
    if (dto.parentId) {
      await this.checkParentCategory(dto.parentId);
    }
    let category;
    if (id > 0 && (category = await this.categoriesService.update(id, dto))) {
      return category;
    }

    throw new BadRequestException('Could not find category by id: ' + id);
  }

  @Delete('/:id')
  async delete(@Param('id') id: number): Promise<any> {
    if (id > 0 && (await this.categoriesService.delete(id))) {
      return {};
    }

    throw new BadRequestException('Could not find category by id: ' + id);
  }

  private async checkParentCategory(categoryId: number) {
    const category = await this.categoriesService.findOneById(categoryId);
    if (!category) {
      throw new BadRequestException(
        'Could not find parent category by id: ' + categoryId,
      );
    }
  }
}
