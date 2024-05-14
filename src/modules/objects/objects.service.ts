import { Injectable, Inject } from '@nestjs/common';
import { ObjectEntity } from './entities/object.entity';
import { FilesService } from '../files/files.service';
import { GetAllObjectsDto } from './dto/get-all-objects.dto';
import { ListingPage } from 'src/core/page/types';
import { listingPage } from 'src/core/page/listing.page';
import { ObjectImageEntity } from './entities/object-image.entity';
import { FileEntity } from '../files/entities/file.entity';
import { ObjectFacilityEntity } from './entities/object-facility.entity';
import { Op } from 'sequelize';
import { FacilityEntity } from './entities/facility.entity';
import { ObjectReviewEntity } from './entities/object-review.entity';
import { Sequelize } from 'sequelize-typescript';

type TheObject = {
  url: string;
  name: string;
  text?: string;
  categoryId: number;
  cityId: number;
  workTimeStart?: string;
  workTimeEnd?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  email?: string;
  phone?: string;
  site?: string;
  linkVk?: string;
  linkTg?: string;
  linkYoutube?: string;
};

@Injectable()
export class ObjectsService {
  constructor(
    @Inject('OBJECTS_REPOSITORY')
    private readonly objectsRepository: typeof ObjectEntity,
    @Inject('OBJECTS_IMAGES_REPOSITORY')
    private readonly objectsImagesRepository: typeof ObjectImageEntity,
    @Inject('OBJECTS_FACILITIES_REPOSITORY')
    private readonly objectsFacilitiesRepository: typeof ObjectFacilityEntity,
    @Inject('OBJECTS_REVIEWS_REPOSITORY')
    private readonly reviewsRepository: typeof ObjectReviewEntity,
    private readonly fileService: FilesService,
  ) {}

  async add(object: TheObject): Promise<ObjectEntity> {
    const payload = {
      url: object.url,
      name: object.name,
      text: object.text,
      category_id: (object.categoryId > 0 && object.categoryId) || null,
      city_id: (object.cityId > 0 && object.cityId) || null,
      work_time_start: object.workTimeStart,
      work_time_end: object.workTimeEnd,
      address: object.address,
      latitude: object.latitude,
      longitude: object.longitude,
      email: object.email,
      phone: object.phone,
      site: object.site,
      link_vk: object.linkVk,
      link_tg: object.linkTg,
      link_youtube: object.linkYoutube,
      total_reviews: 0,
      rating: 0,
    };
    const item = await this.objectsRepository.create(payload);
    return item;
  }

  async update(
    id: number,
    object: Partial<TheObject>,
  ): Promise<ObjectEntity | null> {
    const result = await this.objectsRepository.update(
      {
        name: object.name,
        text: object.text,
        category_id: (object.categoryId > 0 && object.categoryId) || undefined,
        city_id: (object.cityId > 0 && object.cityId) || undefined,
        work_time_start: object.workTimeStart,
        work_time_end: object.workTimeEnd,
        address: object.address,
        latitude: object.latitude,
        longitude: object.longitude,
        email: object.email,
        phone: object.phone,
        site: object.site,
        link_vk: object.linkVk,
        link_tg: object.linkTg,
        link_youtube: object.linkYoutube,
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

  async setLogo(
    id: number,
    file: Express.Multer.File,
  ): Promise<ObjectEntity | null> {
    const object = await this.findOneById(id);
    if (!object) {
      return null;
    }
    const image = await this.fileService.add(file);
    if (!image) {
      return null;
    }

    if (object.logo_id) {
      await this.fileService.delete(object.logo_id);
    }
    const result = await this.objectsRepository.update(
      { logo_id: image.id },
      {
        where: { id },
      },
    );

    return result.length ? this.findOneById(id) : null;
  }

  async addImage(
    id: number,
    file: Express.Multer.File,
    main?: boolean,
    orderNo?: number,
  ): Promise<ObjectEntity | null> {
    const object = await this.findOneById(id);
    if (!object) {
      return null;
    }
    const image = await this.fileService.add(file);
    if (!image) {
      return null;
    }

    await this.objectsImagesRepository.create({
      object_id: id,
      image_id: image.id,
      main: !!main,
      order_no: orderNo !== undefined ? orderNo : object.images.length,
    });

    return this.findOneById(id);
  }

  async deleteImage(id: number, imageId: number): Promise<ObjectEntity | null> {
    const object = await this.findOneById(id);
    if (!object) {
      return null;
    }
    if (!object.images.map((item) => item.id).includes(imageId)) {
      return null;
    }

    const result = await this.objectsImagesRepository.destroy({
      where: { object_id: id, image_id: imageId },
    });

    return result > 0 ? this.findOneById(id) : null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.objectsRepository.destroy({ where: { id } });
    return result > 0;
  }

  async findOneByUrl(url: string): Promise<ObjectEntity> {
    const item = await this.objectsRepository.findOne({
      where: { url },
      include: [
        {
          model: ObjectFacilityEntity,
          include: [
            {
              model: FacilityEntity,
            },
          ],
        },
        {
          model: ObjectImageEntity,
          include: [
            {
              model: FileEntity,
            },
          ],
        },
      ],
    });
    return item;
  }

  async findOneById(id: number): Promise<ObjectEntity> {
    const item = await this.objectsRepository.findOne({
      where: { id },
      include: [
        {
          model: ObjectFacilityEntity,
          include: [
            {
              model: FacilityEntity,
            },
          ],
        },
        {
          model: ObjectImageEntity,
          include: [
            {
              model: FileEntity,
            },
          ],
        },
      ],
    });
    return item;
  }

  async getAll(dto: GetAllObjectsDto): Promise<ListingPage<ObjectEntity>> {
    const list = await this.objectsRepository.findAndCountAll({
      include: {
        model: ObjectImageEntity,
        include: [
          {
            model: FileEntity,
          },
        ],
      },
      where: {
        ...(dto.categoryId && { category_id: dto.categoryId }),
        ...(dto.cityId && { city_id: dto.cityId }),
      },
      order: [[dto?.sortColumn ?? 'id', dto?.sortType ?? 'DESC']],
      offset: (dto.page - 1) * dto.perPage,
      limit: dto.perPage,
    });

    return listingPage<ObjectEntity>(
      list.rows,
      dto.page,
      list.count,
      dto.perPage,
    );
  }

  async setFacilities(id: number, facilitiesIds: number[]) {
    const object = await this.findOneById(id);

    const oldFacilitiesIds = object.facilities.map((facility) => facility.id);
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
      await this.objectsFacilitiesRepository.destroy({
        where: { object_id: id, facility_id: { [Op.in]: forDelete } },
      });
    }
    if (forAdd.length) {
      await this.objectsFacilitiesRepository.bulkCreate(
        forAdd.map((facilityId) => ({
          object_id: id,
          facility_id: facilityId,
        })),
      );
    }

    return this.findOneById(id);
  }

  async calcRatingForObject(objectId: number): Promise<void> {
    const result = await this.reviewsRepository.findAll({
      attributes: [
        [Sequelize.fn('sum', Sequelize.col('rating')), 'total_rating'],
        [Sequelize.fn('count', Sequelize.col('*')), 'total_reviews'],
      ],
      where: { object_id: objectId },
    });
    console.log(result);
    const rating = result[0]['dataValues']['total_rating'] ?? 0;
    const reviews = result[0]['dataValues']['total_reviews'] ?? 0;

    await this.objectsRepository.update(
      {
        total_reviews: reviews,
        rating: rating / reviews,
      },
      { where: { id: objectId } },
    );
  }
}
