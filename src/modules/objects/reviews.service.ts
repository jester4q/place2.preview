import { Inject, Injectable } from '@nestjs/common';
import { ObjectReviewDto } from './dto/object-review.dto';
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

  async getAll(objectId: number): Promise<ObjectReviewDto[]> {
    return (
      await this.reviewsRepository.findAll({
        where: { object_id: objectId },
      })
    ).map((item) => item.toDto());
  }

  async findOneById(id: number): Promise<ObjectReviewDto> {
    const item = await this.reviewsRepository.findOne({
      where: { id },
    });
    return (item && item.toDto()) || null;
  }

  async add(objectId: number, review: Review): Promise<ObjectReviewDto> {
    const item = await this.reviewsRepository.create({
      object_id: objectId,
      user_id: review.userId,
      rating: review.rating,
      text: review.text,
    });
    await this.objectsService.calcRatingForObject(objectId);
    return (item && item.toDto()) || null;
  }

  async update(
    id: number,
    review: Partial<Review>,
  ): Promise<ObjectReviewDto | null> {
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
        await this.objectsService.calcRatingForObject(item.objectId);
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
