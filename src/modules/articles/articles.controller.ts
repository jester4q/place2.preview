import {
  BadRequestException,
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
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ListingPage } from '../../core/page/types';
import { ArticlesCategoriesService } from './articles-categories.service';
import { ArticlesService } from './articles.service';
import { GetAllArticlesDto } from './dto/get-all-articles.dto';
import { ArticleDto } from './dto/article.dto';
import { PatchArticleDto } from './dto/patch.article.dto';
import { AddArticleDto } from './dto/add.article.dto';
import { ApiFile } from '../../core/swagger/api.file';

@Controller('/articles')
@ApiTags('Articles')
export class ArticlesController {
  constructor(
    private readonly articlesService: ArticlesService,
    private readonly categoriesService: ArticlesCategoriesService,
  ) {}

  //@ApiBearerAuth()
  //@UseGuards(AuthGuard('jwt'))
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
    return list;
  }

  @Get('/:url')
  async getByUrl(@Param('url') url: string) {
    let news;
    if (url && (news = await this.articlesService.findOneByUrl(url))) {
      return news;
    }

    throw new BadRequestException('Could not find article by url: ' + url);
  }

  //@ApiBearerAuth()
  //@UseGuards(AuthGuard('jwt'))
  @Post('/')
  async add(@Body() dto: AddArticleDto) {
    await this.checkCategory(dto.categoryId);
    return this.articlesService.add(dto);
  }

  //@ApiBearerAuth()
  //@UseGuards(AuthGuard('jwt'))
  @Patch('/:id')
  async patch(@Param('id') id: number, @Body() dto: PatchArticleDto) {
    if (dto.categoryId) {
      await this.checkCategory(dto.categoryId);
    }
    let news;
    if (id > 0 && (news = await this.articlesService.update(id, dto))) {
      return news;
    }

    throw new BadRequestException('Could not find article by id: ' + id);
  }

  @Post('/:id/image')
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
    let news;
    if (id > 0 && (news = await this.articlesService.setImage(id, file))) {
      return news;
    }

    throw new BadRequestException('Could not find article by id: ' + id);
  }

  @Delete('/:id')
  async delete(@Param('id') id: number): Promise<any> {
    if (id > 0 && (await this.articlesService.delete(id))) {
      return {};
    }

    throw new BadRequestException('Could not find article by id: ' + id);
  }

  private async checkCategory(categoryId: number) {
    const category = await this.categoriesService.findOneById(categoryId);
    if (!category) {
      throw new BadRequestException(
        'Could not find category by id: ' + categoryId,
      );
    }
  }
}
