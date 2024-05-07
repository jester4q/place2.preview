import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  HasOne,
  ForeignKey,
  Default,
} from 'sequelize-typescript';
import { ArticleCategoryEntity } from './article-category.entity';
import { FileEntity } from '../../files/entities/file.entity';
import { ObjectEntity } from '../../objects/entities/object.entity';

@Table({
  tableName: 'events',
})
export class EventEntity extends Model<EventEntity> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  sponsor: string;

  @BelongsTo(() => ArticleCategoryEntity, 'category_id')
  category: ArticleCategoryEntity;

  @ForeignKey(() => ArticleCategoryEntity)
  @Column({
    type: DataType.INTEGER,
  })
  category_id: number;

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
    type: DataType.STRING,
    allowNull: false,
  })
  url: string;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
  })
  price: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  address: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  start_date: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  end_date: Date;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  image_id: number;

  @HasOne(() => FileEntity, 'image_id')
  image: FileEntity;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  object_id: number;

  @HasOne(() => ObjectEntity, 'object_id')
  object: ObjectEntity;
}
