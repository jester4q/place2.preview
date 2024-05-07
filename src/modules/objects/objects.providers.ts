import { FacilityEntity } from './entities/facility.entity';
import { ObjectCategoryEntity } from './entities/object-category.entity';
import { ObjectFacilityEntity } from './entities/object-facility.entity';
import { ObjectImageEntity } from './entities/object-image.entity';
import { ObjectReviewEntity } from './entities/object-review.entity';
import { ObjectTariffEntity } from './entities/object-tariff.entity';
import { ObjectEntity } from './entities/object.entity';
import { TariffCategoryEntity } from './entities/tariff-category.entity';

export const objectsProviders = [
  { provide: 'OBJECTS_CATEGORIES_REPOSITORY', useValue: ObjectCategoryEntity },
  { provide: 'FACILITIES_REPOSITORY', useValue: FacilityEntity },
  { provide: 'OBJECTS_TARIFFS_REPOSITORY', useValue: ObjectTariffEntity },
  { provide: 'OBJECTS_REPOSITORY', useValue: ObjectEntity },
  { provide: 'OBJECTS_IMAGES_REPOSITORY', useValue: ObjectImageEntity },
  { provide: 'OBJECTS_FACILITIES_REPOSITORY', useValue: ObjectFacilityEntity },
  { provide: 'OBJECTS_REVIEWS_REPOSITORY', useValue: ObjectReviewEntity },
  { provide: 'TARIFFS_CATEGORIES_REPOSITORY', useValue: TariffCategoryEntity },
];
