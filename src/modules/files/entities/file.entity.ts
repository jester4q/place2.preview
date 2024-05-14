import { Table, Column, Model, DataType, Default } from 'sequelize-typescript';
import { FileDto } from '../dto/file.dto';

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

  toDto(): FileDto {
    return {
      id: this.id,
      name: this.name,
      uid: this.uid,
      type: this.type,
      size: this.size,
    };
  }
}
