import { Injectable, Inject } from '@nestjs/common';
import { GetAllArticlesDto } from './dto/get-all-articles.dto';
import { ListingPage } from '../../core/page/types';
import { listingPage } from '../../core/page/listing.page';
import { FilesService } from '../files/files.service';
import { ArticleEntity } from './entities/article.entity';
import { ArticleDto } from './dto/article.dto';

type Article = {
  title: string;
  url: string;
  categoryId: number;
  readingTime?: number;
  text?: string;
};

@Injectable()
export class ArticlesService {
  constructor(
    @Inject('ARTICLES_REPOSITORY')
    private readonly articlesRepository: typeof ArticleEntity,
    private readonly fileService: FilesService,
  ) {}

  async add(article: Article): Promise<ArticleDto> {
    const item = await this.articlesRepository.create<ArticleEntity>({
      title: article.title,
      url: article.url,
      category_id: article.categoryId,
      reading_time: article.readingTime,
      text: article.text,
    });
    return this.entityToDto(item);
  }

  async update(
    id: number,
    article: Partial<Article>,
  ): Promise<ArticleDto | null> {
    const result = await this.articlesRepository.update<ArticleEntity>(
      {
        title: article.title,
        url: article.url,
        category_id: article.categoryId,
        reading_time: article.readingTime,
        text: article.text,
      },
      {
        where: {
          id,
        },
      },
    );
    if (result.length && result[0] > 0) {
      return this.findOneById(id);
    }

    return null;
  }

  async setImage(id: number, file: Express.Multer.File): Promise<ArticleDto> {
    const article = await this.findOneById(id);
    if (!article) {
      return null;
    }
    const image = await this.fileService.add(file);
    if (!image) {
      return null;
    }

    if (article.imageId) {
      await this.fileService.delete(article.imageId);
    }
    const result = await this.articlesRepository.update<ArticleEntity>(
      { image_id: image.id },
      {
        where: { id },
      },
    );

    return result.length ? this.findOneById(id) : null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.articlesRepository.destroy({ where: { id } });
    return result > 0;
  }

  async findOneByUrl(url: string): Promise<ArticleDto> {
    const item = await this.articlesRepository.findOne<ArticleEntity>({
      where: { url },
    });
    return (item && this.entityToDto(item)) || null;
  }

  async findOneById(id: number): Promise<ArticleDto> {
    const item = await this.articlesRepository.findOne<ArticleEntity>({
      where: { id },
    });
    return (item && this.entityToDto(item)) || null;
  }

  async getAll(dto: GetAllArticlesDto): Promise<ListingPage<ArticleDto>> {
    const list = await this.articlesRepository.findAndCountAll({
      attributes: { exclude: ['created_at', 'updated_at'] },
      where: {
        ...(dto.categoryId && { category_id: dto.categoryId }),
      },
      order: [[dto?.sortColumn ?? 'id', dto?.sortType ?? 'DESC']],
      offset: (dto.page - 1) * dto.perPage,
      limit: dto.perPage,
    });

    return listingPage<ArticleDto>(
      list.rows.map((e) => this.entityToDto(e)),
      dto.page,
      list.count,
      dto.perPage,
    );
  }

  private entityToDto(article: ArticleEntity): ArticleDto {
    return {
      id: article.id,
      title: article.title,
      url: article.url,
      readingTime: article.reading_time || 0,
      categoryId: article.category_id,
      text: article.text || '',
      imageId: article.image_id || 0,
    };
  }
}
