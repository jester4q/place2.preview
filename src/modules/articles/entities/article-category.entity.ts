import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'articles_categories' })
export class ArticleCategoryEntity extends Model<ArticleCategoryEntity> {
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
}
