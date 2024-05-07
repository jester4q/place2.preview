import {
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { ObjectCategoryEntity } from './object-category.entity';
import { CityEntity } from '../../cities/entities/city.entity';
import { ObjectFacilityEntity } from './object-facility.entity';
import { ObjectImageEntity } from './object-image.entity';
import { ObjectTariffEntity } from './object-tariff.entity';
import { ObjectReviewEntity } from './object-review.entity';
import { FileEntity } from 'src/modules/files/entities/file.entity';
import { ObjectDto } from '../dto/object.dto';
import { formatTimeStr } from 'src/core/utils';

@Table({ tableName: 'objects' })
export class ObjectEntity extends Model<ObjectEntity> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  url: string;

  @Column({
    type: DataType.BLOB,
    allowNull: true,
    get() {
      const text = this.getDataValue('text');
      return (text && text.toString('utf8')) || '';
    },
  })
  text: string;

  @ForeignKey(() => ObjectCategoryEntity)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  category_id: number;

  @BelongsTo(() => ObjectCategoryEntity, 'category_id')
  category: ObjectCategoryEntity;

  @ForeignKey(() => CityEntity)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  city_id: number;

  @BelongsTo(() => CityEntity, 'city_id')
  city: CityEntity;

  @Default(0)
  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  rating: number;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  total_reviews: number;

  @Column({
    type: DataType.TIME,
    allowNull: true,
  })
  work_time_start: string;

  @Column({
    type: DataType.TIME,
    allowNull: true,
  })
  work_time_end: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  logo_id: number;

  @HasOne(() => FileEntity, 'logo_id')
  logo: FileEntity;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  address: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  latitude: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  longitude: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phone: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  site: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  link_vk: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  link_tg: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  link_youtube: string;

  @HasMany(() => ObjectImageEntity)
  images: ObjectImageEntity[];

  @HasMany(() => ObjectFacilityEntity)
  facilities: ObjectFacilityEntity[];

  @HasMany(() => ObjectTariffEntity)
  tariffs: ObjectTariffEntity[];

  @HasMany(() => ObjectReviewEntity)
  reviews: ObjectReviewEntity[];

  toDto(): ObjectDto {
    return {
      id: this.id,
      url: this.url,
      name: this.name,
      text: this.text,
      categoryId: this.category_id,
      cityId: this.city_id,
      workTimeStart:
        (this.work_time_start && formatTimeStr(this.work_time_start)) || null,
      workTimeEnd:
        (this.work_time_end && formatTimeStr(this.work_time_end)) || null,
      address: this.address,
      latitude: this.latitude,
      longitude: this.longitude,
      logoId: this.logo_id,
      email: this.email,
      phone: this.phone,
      site: this.site,
      totalReviews: this.total_reviews,
      rating: this.rating,
      linkVk: this.link_vk,
      linkTg: this.link_tg,
      linkYoutube: this.link_youtube,
      images:
        (this.images &&
          this.images
            .sort((a, b) => {
              if (a.main) {
                return -1;
              }
              if (b.main) {
                return 1;
              }
              const x = a.order_no - b.order_no;
              if (x == 0) {
                return a.id - b.id;
              }
              return x;
            })
            .map((item) => item.image_id)) ||
        [],
      facilities:
        (this.facilities &&
          this.facilities.map((item) => item.facility.toDto())) ||
        [],
      tariffs: (this.tariffs && this.tariffs.map((item) => item.toDto())) || [],
      reviews: (this.reviews && this.reviews.map((item) => item.toDto())) || [],
    };
  }
}
