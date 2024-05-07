import { ArticleCategoryEntity } from './entities/article-category.entity';
import { ArticleEntity } from './entities/article.entity';
import { EventEntity } from './entities/event.entity';

export const articlesProviders = [
  {
    provide: 'ARTICLES_REPOSITORY',
    useValue: ArticleEntity,
  },
  {
    provide: 'ARTICLES_CATEGORIES_REPOSITORY',
    useValue: ArticleCategoryEntity,
  },
  {
    provide: 'EVENTS_REPOSITORY',
    useValue: EventEntity,
  },
];
