import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { objectsProviders } from './objects.providers';
import { ObjectsCategoriesController } from './objects-categories.controller';
import { ObjectsCategoriesService } from './objects-categories.service';
import { FacilitiesController } from './facilities.controller';
import { FacilitiesService } from './facilities.service';
import { ObjectsController } from './objects.controller';
import { ObjectsService } from './objects.service';
import { FilesModule } from '../files/files.module';
import { CitiesModule } from '../cities/cities.module';
import { ObjectsImagesController } from './objects-images.controller';
import { ObjectsFacilitiesController } from './objects-facilities.controller';
import { ObjectsReviewsService } from './reviews.service';
import { ObjectsReviewsController } from './reviews.controller';
import { ObjectsTariffsController } from './tariffs.controller';
import { ObjectsTariffsService } from './tariffs.service';
import { TariffsCategoriesService } from './tariffs-categories.service';
import { TariffsCategoriesController } from './tariffs-categories.controller';

@Module({
  imports: [
    MulterModule.register({ dest: './uploads' }),
    FilesModule,
    CitiesModule,
  ],
  controllers: [
    ObjectsController,
    ObjectsCategoriesController,
    ObjectsImagesController,
    ObjectsFacilitiesController,
    ObjectsReviewsController,
    ObjectsTariffsController,
    FacilitiesController,
    TariffsCategoriesController,
  ],
  providers: [
    ObjectsService,
    ObjectsCategoriesService,
    FacilitiesService,
    ObjectsReviewsService,
    ObjectsTariffsService,
    TariffsCategoriesService,
    ...objectsProviders,
  ],
})
export class ObjectsModule {}
