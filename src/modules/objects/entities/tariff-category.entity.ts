import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { ObjectCategoryEntity } from './object-category.entity';

@Table({ tableName: 'tariffs_categories' })
export class TariffCategoryEntity extends Model<TariffCategoryEntity> {
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  url: string;

  @ForeignKey(() => ObjectCategoryEntity)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  category_id: number;

  @BelongsTo(() => ObjectCategoryEntity, 'category_id')
  category: ObjectCategoryEntity;

  toDto() {
    return {
      id: this.id,
      name: this.name,
      url: this.url,
      categoryId: this.category_id,
    };
  }
}
