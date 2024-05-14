import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ObjectCategoryDto } from '../dto/object-category.dto';

@Table({ tableName: 'objects_categories' })
export class ObjectCategoryEntity extends Model<ObjectCategoryEntity> {
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

  @BelongsTo(() => ObjectCategoryEntity, 'parent_id')
  parent: ObjectCategoryEntity;

  @ForeignKey(() => ObjectCategoryEntity)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  parent_id: number;

  toDto(): ObjectCategoryDto {
    return {
      id: this.id,
      name: this.name,
      parentId: this.parent_id,
      url: this.url,
    };
  }
  /*
  toDto(): ObjectCategoryDto {
    return {
      id: this.id,
      name: this.name,
      url: this.url,
      parentId: this.parent_id,
      children: [],
    };
  }
  */
}
