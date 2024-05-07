import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ObjectCategoryEntity } from './object-category.entity';
import { FacilityDto } from '../dto/facility.dto';

@Table({ tableName: 'facilities' })
export class FacilityEntity extends Model<FacilityEntity> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  icon: string;

  @ForeignKey(() => ObjectCategoryEntity)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  category_id: number;

  @BelongsTo(() => ObjectCategoryEntity, 'category_id')
  category: ObjectCategoryEntity;

  toDto(): FacilityDto {
    return {
      id: this.id,
      name: this.name,
      icon: this.icon,
      categoryId: this.category_id,
    };
  }
}
