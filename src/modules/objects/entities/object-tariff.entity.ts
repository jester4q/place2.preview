import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { ObjectEntity } from './object.entity';
import { TariffCategoryEntity } from './tariff-category.entity';
import { ObjectTariffFacilityEntity } from './object-tariff-facility.entity';
import { ObjectCategoryEntity } from './object-category.entity';
import { ObjectTariffDto } from '../dto/object-tariff.dto';

@Table({ tableName: 'objects_tariffs' })
export class ObjectTariffEntity extends Model<ObjectTariffEntity> {
  @ForeignKey(() => ObjectEntity)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  object_id: number;

  @BelongsTo(() => ObjectEntity, 'object_id')
  object: ObjectEntity;

  @ForeignKey(() => TariffCategoryEntity)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  tariff_category_id: number;

  @BelongsTo(() => TariffCategoryEntity, 'tariff_category_id')
  tariff_category: TariffCategoryEntity;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.BLOB,
    allowNull: true,
    get() {
      const text = this.getDataValue('text');
      return (text && text.toString('utf8')) || '';
    },
  })
  text: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  rating: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  price: number;

  @HasMany(() => ObjectTariffFacilityEntity)
  facilities: ObjectTariffFacilityEntity[];

  toDto(): ObjectTariffDto {
    return {
      id: this.id,
      title: this.title,
      price: this.price,
      tariffCategoryId: this.tariff_category_id,
      rating: this.rating,
      objectId: this.object_id,
      facilities:
        (this.facilities &&
          this.facilities.map((item) => item.facility.toDto())) ||
        [],
    };
  }
}
