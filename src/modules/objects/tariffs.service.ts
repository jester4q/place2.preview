import { Inject, Injectable } from '@nestjs/common';
import { FacilityEntity } from './entities/facility.entity';
import { FacilityDto } from './dto/facility.dto';
import { ObjectTariffEntity } from './entities/object-tariff.entity';
import { ObjectTariffDto } from './dto/object-tariff.dto';
import { ObjectTariffFacilityEntity } from './entities/object-tariff-facility.entity';

type ObjectTariff = {
  tariffCategoryId: number;
  title: string;
  text?: string;
  price?: number;
};

@Injectable()
export class ObjectsTariffsService {
  constructor(
    @Inject('OBJECTS_TARIFFS_REPOSITORY')
    private readonly tariffsRepository: typeof ObjectTariffEntity,
  ) {}

  async getAll(objectId: number): Promise<ObjectTariffDto[]> {
    return (
      await this.tariffsRepository.findAll({
        where: { object_id: objectId },
        include: {
          model: ObjectTariffFacilityEntity,
          include: [
            {
              model: FacilityEntity,
            },
          ],
        },
      })
    ).map((item) => item.toDto());
  }

  async findOneById(id: number): Promise<ObjectTariffDto> {
    const item = await this.tariffsRepository.findOne({
      include: {
        model: ObjectTariffFacilityEntity,
        include: [
          {
            model: FacilityEntity,
          },
        ],
      },
      where: { id },
    });
    return (item && item.toDto()) || null;
  }

  async add(objectId: number, tariff: ObjectTariff): Promise<ObjectTariffDto> {
    const item = await this.tariffsRepository.create({
      object_id: objectId,
      tariff_category_id: tariff.tariffCategoryId,
      title: tariff.title,
      price: tariff.price,
      rating: 0,
    });
    return item.toDto();
  }

  async setFacilities(id: number, facilitiesIds: number[]) {
    const tariff = await this.findOneById(id);

    const oldFacilitiesIds = tariff.facilities.map((facility) => facility.id);
    const forAdd = [];
    const forDelete = [];
    for (let i = 0; i < facilitiesIds.length; i++) {
      const facilityId = facilitiesIds[i];
      const exist = oldFacilitiesIds.includes(facilityId);
      if (!exist) {
        forAdd.push(facilityId);
      }
    }

    for (let i = 0; i < oldFacilitiesIds.length; i++) {
      const facilityId = oldFacilitiesIds[i];
      const exist = facilitiesIds.includes(facilityId);
      if (!exist) {
        forDelete.push(facilityId);
      }
    }
  }

  async update(
    id: number,
    tariff: Partial<ObjectTariff>,
  ): Promise<ObjectTariffDto | null> {
    const result = await this.tariffsRepository.update(
      {
        tariff_category_id: tariff.tariffCategoryId,
        title: tariff.title,
        price: tariff.price,
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
    const result = await this.tariffsRepository.destroy({ where: { id } });
    return result > 0;
  }
}
