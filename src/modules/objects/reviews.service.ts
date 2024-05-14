import { Inject, Injectable } from '@nestjs/common';
import { ObjectReviewEntity } from './entities/object-review.entity';
import { ObjectsService } from './objects.service';

type Review = {
  userId: number;
  text: string;
  rating: number;
};

@Injectable()
export class ObjectsReviewsService {
  constructor(
    @Inject('OBJECTS_REVIEWS_REPOSITORY')
    private readonly reviewsRepository: typeof ObjectReviewEntity,
    private readonly objectsService: ObjectsService,
  ) {}

  async getAll(objectId: number): Promise<ObjectReviewEntity[]> {
    return await this.reviewsRepository.findAll({
      where: { object_id: objectId },
    });
  }

  async findOneById(id: number): Promise<ObjectReviewEntity> {
    const item = await this.reviewsRepository.findOne({
      where: { id },
    });
    return item;
  }

  async add(objectId: number, review: Review): Promise<ObjectReviewEntity> {
    const item = await this.reviewsRepository.create({
      object_id: objectId,
      user_id: review.userId,
      rating: review.rating,
      text: review.text,
    });
    await this.objectsService.calcRatingForObject(objectId);
    return item;
  }

  async update(
    id: number,
    review: Partial<Review>,
  ): Promise<ObjectReviewEntity | null> {
    const result = await this.reviewsRepository.update(
      {
        rating: review.rating,
        text: review.text,
      },
      {
        where: {
          id,
        },
      },
    );
    if (result.length && result[0] > 0) {
      const item = await this.findOneById(id);
      if (review.rating !== undefined) {
        await this.objectsService.calcRatingForObject(item.object_id);
      }
      return item;
    }

    return null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.reviewsRepository.destroy({ where: { id } });
    return result > 0;
  }
}
