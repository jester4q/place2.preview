import { Table, Column, Model, DataType, Default } from 'sequelize-typescript';

@Table({ tableName: 'files' })
export class FileEntity extends Model<FileEntity> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  uid: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  type: string;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  size: number;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  orderNo: number;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  main: boolean;
}
