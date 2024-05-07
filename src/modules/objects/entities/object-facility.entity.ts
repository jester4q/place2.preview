import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ObjectEntity } from './object.entity';
import { FacilityEntity } from './facility.entity';

@Table({ tableName: 'objects_facilities' })
export class ObjectFacilityEntity extends Model<ObjectFacilityEntity> {
  @ForeignKey(() => ObjectEntity)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  object_id: number;

  @ForeignKey(() => FacilityEntity)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  facility_id: FacilityEntity;

  @BelongsTo(() => FacilityEntity, 'facility_id')
  facility: FacilityEntity;
}
