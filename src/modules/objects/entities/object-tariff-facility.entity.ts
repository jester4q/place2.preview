import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { FacilityEntity } from './facility.entity';
import { ObjectTariffEntity } from './object-tariff.entity';

@Table({ tableName: 'objects_tariffs_facilities' })
export class ObjectTariffFacilityEntity extends Model<ObjectTariffFacilityEntity> {
  @ForeignKey(() => ObjectTariffEntity)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  tariff_id: number;

  @ForeignKey(() => FacilityEntity)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  facility_id: FacilityEntity;

  @BelongsTo(() => FacilityEntity, 'facility_id')
  facility: FacilityEntity;
}
