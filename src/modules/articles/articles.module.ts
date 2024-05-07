import { Module } from '@nestjs/common';
import { FilesModule } from '../files/files.module';
import { MulterModule } from '@nestjs/platform-express';
import { ArticlesController } from './articles.controller';
import { ArticlesCategoriesController } from './articles-categories.controller';
import { ArticlesService } from './articles.service';
import { ArticlesCategoriesService } from './articles-categories.service';
import { articlesProviders } from './articles.providers';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  imports: [MulterModule.register({ dest: './uploads' }), FilesModule],
  controllers: [
    ArticlesController,
    ArticlesCategoriesController,
    EventsController,
  ],
  providers: [
    ArticlesService,
    ArticlesCategoriesService,
    EventsService,
    ...articlesProviders,
  ],
})
export class ArticlesModule {}
