import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AddArticleCategoryDto } from './dto/add.article-category.dto';
import { PatchArticleCategoryDto } from './dto/patch.article-category.dto';
import { ArticleCategoryDto } from './dto/article-category.dto';
import { ArticlesCategoriesService } from './articles-categories.service';

@Controller('/articles-categories')
@ApiTags('Articles')
export class ArticlesCategoriesController {
  constructor(private readonly categoriesService: ArticlesCategoriesService) {}

  @Get('/')
  async getAll(): Promise<ArticleCategoryDto[]> {
    const list = await this.categoriesService.getAll();
    return list;
  }

  @Get('/:id')
  async get(@Param('id') id: number): Promise<ArticleCategoryDto> {
    const item = await this.categoriesService.findOneById(id);
    if (!item) {
      throw new BadRequestException('Could not find category by id: ' + id);
    }
    return item;
  }

  @Post('/')
  async add(@Body() dto: AddArticleCategoryDto) {
    return this.categoriesService.add(dto);
  }

  @Patch('/:id')
  async patch(@Param('id') id: number, @Body() dto: PatchArticleCategoryDto) {
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
}
