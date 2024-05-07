import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'cities' })
export class CityEntity extends Model<CityEntity> {
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
}
