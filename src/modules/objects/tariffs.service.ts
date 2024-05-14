import { Inject, Injectable } from '@nestjs/common';
import { FacilityEntity } from './entities/facility.entity';
import { ObjectTariffEntity } from './entities/object-tariff.entity';
import { ObjectTariffFacilityEntity } from './entities/object-tariff-facility.entity';
import { Op } from 'sequelize';

type ObjectTariff = {
  tariffCategoryId: number;
  title: string;
  text?: string;
  price?: number;
  facilitiesIds?: number[];
};

@Injectable()
export class ObjectsTariffsService {
  constructor(
    @Inject('OBJECTS_TARIFFS_REPOSITORY')
    private readonly tariffsRepository: typeof ObjectTariffEntity,
    @Inject('TARIFFS_FACILITIES_REPOSITORY')
    private readonly tariffsFacilitiesRepository: typeof ObjectTariffFacilityEntity,
  ) {}

  async getAll(objectId: number): Promise<ObjectTariffEntity[]> {
    return await this.tariffsRepository.findAll({
      where: { object_id: objectId },
      include: {
        model: ObjectTariffFacilityEntity,
        include: [
          {
            model: FacilityEntity,
          },
        ],
      },
    });
  }

  async findOneById(id: number): Promise<ObjectTariffEntity> {
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
    return item;
  }

  async add(
    objectId: number,
    tariff: ObjectTariff,
  ): Promise<ObjectTariffEntity> {
    const item = await this.tariffsRepository.create({
      object_id: objectId,
      tariff_category_id: tariff.tariffCategoryId,
      title: tariff.title,
      price: tariff.price,
      rating: 0,
    });
    if (tariff.facilitiesIds) {
      await this.setFacilities(item.id, tariff.facilitiesIds);
    }
    return item;
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

    if (forDelete.length) {
      await this.tariffsFacilitiesRepository.destroy({
        where: { tariff_id: id, facility_id: { [Op.in]: forDelete } },
      });
    }
    if (forAdd.length) {
      await this.tariffsFacilitiesRepository.bulkCreate(
        forAdd.map((facilityId) => ({
          tariff_id: id,
          facility_id: facilityId,
        })),
      );
    }
  }

  async update(
    id: number,
    tariff: Partial<ObjectTariff>,
  ): Promise<ObjectTariffEntity | null> {
    let success = false;
    if (tariff.facilitiesIds) {
      await this.setFacilities(id, tariff.facilitiesIds);
      success = true;
    }
    const payload = {
      tariff_category_id: tariff.tariffCategoryId,
      title: tariff.title,
      price: tariff.price,
    };
    if (Object.values(payload).some((val) => val !== undefined)) {
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
      success = result.length && result[0] > 0;
    }

    if (success) {
      return this.findOneById(id);
    }

    return null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.tariffsRepository.destroy({ where: { id } });
    return result > 0;
  }
}
