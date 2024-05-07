import { Inject, Injectable } from '@nestjs/common';
import { FacilityEntity } from './entities/facility.entity';
import { FacilityDto } from './dto/facility.dto';
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

  async getAll(categoryId: number): Promise<FacilityDto[]> {
    return (
      await this.facilitiesRepository.findAll({
        where: { category_id: categoryId },
      })
    ).map((item) => item.toDto());
  }

  async findOneById(id: number): Promise<FacilityDto> {
    const item = await this.facilitiesRepository.findOne({
      where: { id },
    });
    return (item && item.toDto()) || null;
  }

  async add(categoryId: number, facility: Facility): Promise<FacilityDto> {
    const item = await this.facilitiesRepository.create({
      category_id: categoryId,
      name: facility.name,
      icon: facility.icon,
    });
    return (item && item.toDto()) || null;
  }

  async update(
    id: number,
    facility: Partial<Facility>,
  ): Promise<FacilityDto | null> {
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

  async findForCategory(categoryId): Promise<FacilityDto[]> {
    const path = await this.categoryService.getPath(categoryId);
    const facilities = await this.facilitiesRepository.findAll({
      where: { category_id: { [Op.in]: path } },
    });
    return facilities.map((item) => item.toDto());
  }
}
