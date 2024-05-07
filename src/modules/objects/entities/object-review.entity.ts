import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { UserEntity } from '../../users/entities/user.entity';
import { ObjectEntity } from './object.entity';
import { ObjectReviewDto } from '../dto/object-review.dto';

@Table({ tableName: 'objects_reviews' })
export class ObjectReviewEntity extends Model<ObjectReviewEntity> {
  //@ForeignKey(() => UserEntity)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id: number;

  @BelongsTo(() => UserEntity, 'user_id')
  user: UserEntity;

  @ForeignKey(() => ObjectEntity)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  object_id: number;

  @BelongsTo(() => ObjectEntity, 'object_id')
  object: ObjectEntity;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  text: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  rating: number;

  toDto(): ObjectReviewDto {
    return {
      id: this.id,
      userId: this.user_id,
      objectId: this.object_id,
      text: this.text,
      rating: this.rating,
    };
  }
}
