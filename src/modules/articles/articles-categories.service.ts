import { Injectable, Inject } from '@nestjs/common';
import { ArticleCategoryEntity } from './entities/article-category.entity';
import { ArticleCategoryDto } from './dto/article-category.dto';

type ArticleCategory = {
  name: string;
  url: string;
};

@Injectable()
export class ArticlesCategoriesService {
  constructor(
    @Inject('ARTICLES_CATEGORIES_REPOSITORY')
    private readonly categoriesRepository: typeof ArticleCategoryEntity,
  ) {}

  async add(category: ArticleCategory): Promise<ArticleCategoryDto> {
    const item = await this.categoriesRepository.create<ArticleCategoryEntity>({
      name: category.name,
      url: category.url,
    });
    return item ? this.entityToDto(item) : null;
  }

  async update(
    id: number,
    category: Partial<ArticleCategory>,
  ): Promise<ArticleCategoryDto | null> {
    const result =
      await this.categoriesRepository.update<ArticleCategoryEntity>(
        { name: category.name, url: category.url },
        {
          where: { id },
        },
      );
    if (result.length && result[0] > 0) {
      return this.findOneById(id);
    }

    return null;
  }

  async findOneByUrl(url: string): Promise<ArticleCategoryDto | null> {
    if (!url) {
      return null;
    }
    const item = await this.categoriesRepository.findOne<ArticleCategoryEntity>(
      {
        where: { url },
      },
    );

    return item ? this.entityToDto(item) : null;
  }

  async findOneById(id: number): Promise<ArticleCategoryDto | null> {
    if (!id) {
      return null;
    }
    const item = await this.categoriesRepository.findOne<ArticleCategoryEntity>(
      {
        where: { id },
      },
    );

    return item ? this.entityToDto(item) : null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.categoriesRepository.destroy({
      where: { id },
    });
    return result > 0;
  }

  async getAll(): Promise<ArticleCategoryDto[]> {
    const list = await this.categoriesRepository.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      order: [['name', 'ASC']],
    });

    return list.map((e) => this.entityToDto(e));
  }

  private entityToDto(category: ArticleCategoryEntity): ArticleCategoryDto {
    return {
      id: category.id,
      name: category.name,
      url: category.url,
    };
  }
}
