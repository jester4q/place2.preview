import {
  NotFoundException,
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AddArticleCategoryDto } from './dto/add.article-category.dto';
import { PatchArticleCategoryDto } from './dto/patch.article-category.dto';
import { ArticleCategoryDto } from './dto/article-category.dto';
import { ArticlesCategoriesService } from './articles-categories.service';
import { AuthGuard } from '@nestjs/passport';
import { UserRolesGuard } from '../users/roles/roles.guard';
import { HasRoles } from '../users/roles/roles.decorator';
import { UserRoleEnum } from '../users/entities/user-group.entity';

@Controller('/articles-categories')
@ApiTags('Articles')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), UserRolesGuard)
export class ArticlesCategoriesController {
  constructor(private readonly categoriesService: ArticlesCategoriesService) {}

  @Get('/')
  async getAll(): Promise<ArticleCategoryDto[]> {
    const list = await this.categoriesService.getAll();
    return list.map((item) => item.toDto());
  }

  @Get('/:id')
  async get(@Param('id') id: number): Promise<ArticleCategoryDto> {
    const item = await this.categoriesService.findOneById(id);
    if (!item) {
      throw new NotFoundException('Could not find category by id: ' + id);
    }
    return item.toDto();
  }

  @Post('/')
  @HasRoles(UserRoleEnum.admin)
  async add(@Body() dto: AddArticleCategoryDto) {
    const item = this.categoriesService.add(dto);
    return (await item).toDto();
  }

  @Patch('/:id')
  @HasRoles(UserRoleEnum.admin)
  async patch(@Param('id') id: number, @Body() dto: PatchArticleCategoryDto) {
    let category;
    if (id > 0 && (category = await this.categoriesService.update(id, dto))) {
      return category.toDto();
    }

    throw new NotFoundException('Could not find category by id: ' + id);
  }

  @Delete('/:id')
  @HasRoles(UserRoleEnum.admin)
  async delete(@Param('id') id: number): Promise<any> {
    if (id > 0 && (await this.categoriesService.delete(id))) {
      return {};
    }

    throw new NotFoundException('Could not find category by id: ' + id);
  }
}
