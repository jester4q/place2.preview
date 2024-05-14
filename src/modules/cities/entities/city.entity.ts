import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { CityDto } from '../dto/city.dto';

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

  toDto(): CityDto {
    return {
      id: this.id,
      name: this.name,
      url: this.url,
    };
  }
}
