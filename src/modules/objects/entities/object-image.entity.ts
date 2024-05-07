import {
  BeforeCreate,
  BeforeUpdate,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ObjectEntity } from './object.entity';
import { FileEntity } from '../../files/entities/file.entity';
import { Op } from 'sequelize';

@Table({ tableName: 'objects_images' })
export class ObjectImageEntity extends Model<ObjectImageEntity> {
  @ForeignKey(() => ObjectEntity)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  object_id: number;

  @ForeignKey(() => FileEntity)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  image_id: number;

  @BelongsTo(() => FileEntity, 'image_id')
  image: FileEntity;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  order_no: number;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  main: boolean;

  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(image: ObjectImageEntity) {
    if (image.main) {
      const mainImage = await ObjectImageEntity.findAll({
        where: { object_id: image.object_id, main: true },
      });
      if (mainImage.length) {
        await ObjectImageEntity.update(
          { main: false },
          { where: { id: { [Op.in]: mainImage.map((item) => item.id) } } },
        );
      }
    }
  }
}
