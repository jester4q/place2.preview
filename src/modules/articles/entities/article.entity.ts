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
import { ArticleDto } from '../dto/article.dto';

@Table({
  tableName: 'articles' /*charset: 'utf8mb4', collate: 'utf8mb4_general_ci' */,
})
export class ArticleEntity extends Model<ArticleEntity> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
  })
  reading_time: number;

  @ForeignKey(() => ArticleCategoryEntity)
  @Column({
    type: DataType.INTEGER,
  })
  category_id: number;

  @BelongsTo(() => ArticleCategoryEntity, 'category_id')
  category: ArticleCategoryEntity;

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

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  image_id: number;

  @HasOne(() => FileEntity, 'image_id')
  image: FileEntity;

  toDto(): ArticleDto {
    return {
      id: this.id,
      title: this.title,
      url: this.url,
      readingTime: this.reading_time || 0,
      categoryId: this.category_id,
      text: this.text || '',
      imageId: this.image_id || 0,
    };
  }
}
