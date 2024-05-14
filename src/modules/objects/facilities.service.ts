import { Inject, Injectable } from '@nestjs/common';
import { FacilityEntity } from './entities/facility.entity';
import { Op } from 'sequelize';
import { ObjectsCategoriesService } from './objects-categories.service';

type Facility = {
  name: string;
  icon: string;
};

@Injectable()
export class FacilitiesService {
  constructor(
    @Inject('FACILITIES_REPOSITORY')
    private readonly facilitiesRepository: typeof FacilityEntity,
    private readonly categoryService: ObjectsCategoriesService,
  ) {}

  async getAll(categoryId: number): Promise<FacilityEntity[]> {
    return this.facilitiesRepository.findAll({
      where: { category_id: categoryId },
    });
  }

  async findOneById(id: number): Promise<FacilityEntity> {
    const item = await this.facilitiesRepository.findOne({
      where: { id },
    });
    return item;
  }

  async add(categoryId: number, facility: Facility): Promise<FacilityEntity> {
    const item = await this.facilitiesRepository.create({
      category_id: categoryId,
      name: facility.name,
      icon: facility.icon,
    });
    return item;
  }

  async update(
    id: number,
    facility: Partial<Facility>,
  ): Promise<FacilityEntity | null> {
    const result = await this.facilitiesRepository.update(
      {
        name: facility.name,
        icon: facility.icon,
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
    const result = await this.facilitiesRepository.destroy({ where: { id } });
    return result > 0;
  }

  async findForCategory(categoryId): Promise<FacilityEntity[]> {
    const path = await this.categoryService.getPath(categoryId);
    const facilities = await this.facilitiesRepository.findAll({
      where: { category_id: { [Op.in]: path } },
    });
    return facilities;
  }
}
