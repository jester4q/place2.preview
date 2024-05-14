import { Injectable, Inject } from '@nestjs/common';
import { ArticleCategoryEntity } from './entities/article-category.entity';

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

  async add(category: ArticleCategory): Promise<ArticleCategoryEntity> {
    const item = await this.categoriesRepository.create({
      name: category.name,
      url: category.url,
    });
    return item;
  }

  async update(
    id: number,
    category: Partial<ArticleCategory>,
  ): Promise<ArticleCategoryEntity> {
    const result = await this.categoriesRepository.update(
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

  async findOneByUrl(url: string): Promise<ArticleCategoryEntity> {
    if (!url) {
      return null;
    }
    const item = await this.categoriesRepository.findOne({
      where: { url },
    });

    return item;
  }

  async findOneById(id: number): Promise<ArticleCategoryEntity> {
    if (!id) {
      return null;
    }
    const item = await this.categoriesRepository.findOne({
      where: { id },
    });

    return item;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.categoriesRepository.destroy({
      where: { id },
    });
    return result > 0;
  }

  async getAll(): Promise<ArticleCategoryEntity[]> {
    const list = await this.categoriesRepository.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      order: [['name', 'ASC']],
    });

    return list;
  }
}
