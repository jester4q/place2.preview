import {
  BadRequestException,
  NotFoundException,
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Delete,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  FileTypeValidator,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ListingPage } from '../../core/page/types';
import { ArticlesCategoriesService } from './articles-categories.service';
import { ArticlesService } from './articles.service';
import { GetAllArticlesDto } from './dto/get-all-articles.dto';
import { ArticleDto } from './dto/article.dto';
import { PatchArticleDto } from './dto/patch.article.dto';
import { AddArticleDto } from './dto/add.article.dto';
import { ApiFile } from '../../core/swagger/api.file';
import { AuthGuard } from '@nestjs/passport';
import { UserRolesGuard } from '../users/roles/roles.guard';
import { HasRoles } from '../users/roles/roles.decorator';
import { UserRoleEnum } from '../users/entities/user-group.entity';

@Controller('/articles')
@ApiTags('Articles')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), UserRolesGuard)
export class ArticlesController {
  constructor(
    private readonly articlesService: ArticlesService,
    private readonly categoriesService: ArticlesCategoriesService,
  ) {}

  @Get('/')
  async getAll(
    @Query() dto: GetAllArticlesDto,
  ): Promise<ListingPage<ArticleDto>> {
    if (dto.sortColumn) {
      const sort = dto.sortColumn;
      if (!['title', 'id'].includes(sort)) {
        throw new BadRequestException('Sort column is not valid');
      }
    }

    const list = await this.articlesService.getAll(dto);
    return {
      ...list,
      items: list.items.map((item) => item.toDto()),
    };
  }

  @Get('/:url')
  async getByUrl(@Param('url') url: string) {
    let article;
    if (url && (article = await this.articlesService.findOneByUrl(url))) {
      return article.toDto();
    }

    throw new NotFoundException('Could not find article by url: ' + url);
  }

  @Post('/')
  @HasRoles(UserRoleEnum.admin)
  async add(@Body() dto: AddArticleDto) {
    await this.checkCategory(dto.categoryId);
    const item = await this.articlesService.add(dto);
    return item.toDto();
  }

  @Patch('/:id')
  @HasRoles(UserRoleEnum.admin)
  async patch(@Param('id') id: number, @Body() dto: PatchArticleDto) {
    if (dto.categoryId) {
      await this.checkCategory(dto.categoryId);
    }
    let article;
    if (id > 0 && (article = await this.articlesService.update(id, dto))) {
      return article.toDto();
    }

    throw new NotFoundException('Could not find article by id: ' + id);
  }

  @Post('/:id/image')
  @HasRoles(UserRoleEnum.admin)
  @UseInterceptors(FileInterceptor('file'))
  @ApiFile()
  @ApiConsumes('multipart/form-data')
  async uploadFile(
    @Param('id') id: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image' })],
      }),
    )
    file: Express.Multer.File,
  ): Promise<ArticleDto> {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }
    let article;
    if (id > 0 && (article = await this.articlesService.setImage(id, file))) {
      return article.toDto();
    }

    throw new NotFoundException('Could not find article by id: ' + id);
  }

  @Delete('/:id')
  @HasRoles(UserRoleEnum.admin)
  async delete(@Param('id') id: number): Promise<any> {
    if (id > 0 && (await this.articlesService.delete(id))) {
      return {};
    }

    throw new NotFoundException('Could not find article by id: ' + id);
  }

  private async checkCategory(categoryId: number) {
    const category = await this.categoriesService.findOneById(categoryId);
    if (!category) {
      throw new NotFoundException(
        'Could not find category by id: ' + categoryId,
      );
    }
  }
}
