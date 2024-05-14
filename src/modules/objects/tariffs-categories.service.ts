import { Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { ObjectsCategoriesService } from './objects-categories.service';
import { TariffCategoryEntity } from './entities/tariff-category.entity';

type TariffCategory = {
  name: string;
  url: string;
};

@Injectable()
export class TariffsCategoriesService {
  constructor(
    @Inject('TARIFFS_CATEGORIES_REPOSITORY')
    private readonly tariffCategoryRepository: typeof TariffCategoryEntity,
    private readonly categoryService: ObjectsCategoriesService,
  ) {}

  async getAll(categoryId: number): Promise<TariffCategoryEntity[]> {
    return this.tariffCategoryRepository.findAll({
      where: { category_id: categoryId },
    });
  }

  async findOneById(id: number): Promise<TariffCategoryEntity> {
    const item = await this.tariffCategoryRepository.findOne({
      where: { id },
    });
    return item;
  }

  async findOneByUrl(url: string): Promise<TariffCategoryEntity> {
    const item = await this.tariffCategoryRepository.findOne({
      where: { url },
    });
    return item;
  }

  async add(
    categoryId: number,
    tariffCategory: TariffCategory,
  ): Promise<TariffCategoryEntity> {
    const item = await this.tariffCategoryRepository.create({
      category_id: categoryId,
      name: tariffCategory.name,
      url: tariffCategory.url,
    });
    return item;
  }

  async update(
    id: number,
    tariffCategory: Partial<TariffCategory>,
  ): Promise<TariffCategoryEntity | null> {
    const result = await this.tariffCategoryRepository.update(
      {
        name: tariffCategory.name,
        url: tariffCategory.url,
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

  async delete(id: number): Promise<boolean> {
    const result = await this.tariffCategoryRepository.destroy({
      where: { id },
    });
    return result > 0;
  }

  async findForCategory(categoryId: number): Promise<TariffCategoryEntity[]> {
    const path = await this.categoryService.getPath(categoryId);
    const categories = await this.tariffCategoryRepository.findAll({
      where: { category_id: { [Op.in]: path } },
    });
    return categories;
  }
}
