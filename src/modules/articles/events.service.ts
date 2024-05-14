import { Injectable, Inject } from '@nestjs/common';
import { GetAllArticlesDto } from './dto/get-all-articles.dto';
import { ListingPage } from '../../core/page/types';
import { listingPage } from '../../core/page/listing.page';
import { FilesService } from '../files/files.service';
import { EventEntity } from './entities/event.entity';
import { strToDate } from 'src/core/utils';

type Event = {
  title: string;
  url: string;
  categoryId: number;
  sponsor?: string;
  text?: string;
  objectId?: number;
  address?: string;
  price?: number;
  startDate?: string;
  endDate?: string;
};

@Injectable()
export class EventsService {
  constructor(
    @Inject('EVENTS_REPOSITORY')
    private readonly eventsRepository: typeof EventEntity,
    private readonly fileService: FilesService,
  ) {}

  async add(event: Event): Promise<EventEntity> {
    const item = await this.eventsRepository.create({
      title: event.title,
      url: event.url,
      category_id: event.categoryId,
      sponsor: event.sponsor,
      text: event.text,
      object_id: event.objectId,
      address: event.address,
      price: event.price,
      start_date: strToDate(event.startDate),
      end_date: strToDate(event.endDate),
    });
    return item;
  }

  async update(id: number, event: Partial<Event>): Promise<EventEntity> {
    const patch: Partial<EventEntity> = {
      title: event.title,
      url: event.url,
      category_id: event.categoryId,
      sponsor: event.sponsor,
      text: event.text,
      price: event.price,
      address: event.address,
      object_id: event.objectId,
    };
    if (event.startDate !== undefined) {
      patch.start_date =
        (event.startDate && strToDate(event.startDate)) || null;
      patch.end_date = (event.endDate && strToDate(event.endDate)) || null;
    }

    const result = await this.eventsRepository.update<EventEntity>(patch, {
      where: {
        id,
      },
    });
    if (result.length && result[0] > 0) {
      return this.findOneById(id);
    }

    return null;
  }

  async setImage(id: number, file: Express.Multer.File): Promise<EventEntity> {
    const event = await this.findOneById(id);
    if (!event) {
      return null;
    }
    const image = await this.fileService.add(file);
    if (!image) {
      return null;
    }

    if (event.image_id) {
      await this.fileService.delete(event.image_id);
    }
    const result = await this.eventsRepository.update<EventEntity>(
      { image_id: image.id },
      {
        where: { id },
      },
    );

    return result.length ? this.findOneById(id) : null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.eventsRepository.destroy({ where: { id } });
    return result > 0;
  }

  async findOneByUrl(url: string): Promise<EventEntity> {
    const item = await this.eventsRepository.findOne<EventEntity>({
      where: { url },
    });
    return item;
  }

  async findOneById(id: number): Promise<EventEntity> {
    const item = await this.eventsRepository.findOne<EventEntity>({
      where: { id },
    });
    return item;
  }

  async getAll(dto: GetAllArticlesDto): Promise<ListingPage<EventEntity>> {
    const list = await this.eventsRepository.findAndCountAll({
      where: {
        ...(dto.categoryId && { category_id: dto.categoryId }),
      },
      order: [[dto?.sortColumn ?? 'id', dto?.sortType ?? 'DESC']],
      offset: (dto.page - 1) * dto.perPage,
      limit: dto.perPage,
    });

    return listingPage<EventEntity>(
      list.rows,
      dto.page,
      list.count,
      dto.perPage,
    );
  }
}
