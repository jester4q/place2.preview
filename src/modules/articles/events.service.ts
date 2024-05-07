import { Injectable, Inject } from '@nestjs/common';
import { GetAllArticlesDto } from './dto/get-all-articles.dto';
import { ListingPage } from '../../core/page/types';
import { listingPage } from '../../core/page/listing.page';
import { FilesService } from '../files/files.service';
import { EventEntity } from './entities/event.entity';
import { EventDto } from './dto/event.dto';
import { dateToStr, strToDate } from 'src/core/utils';

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

  async add(event: Event): Promise<EventDto> {
    const item = await this.eventsRepository.create<EventEntity>({
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
    return this.entityToDto(item);
  }

  async update(id: number, event: Partial<Event>): Promise<EventDto | null> {
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
    if (result) {
      return this.findOneById(id);
    }

    return null;
  }

  async setImage(id: number, file: Express.Multer.File): Promise<EventDto> {
    const event = await this.findOneById(id);
    if (!event) {
      return null;
    }
    const image = await this.fileService.add(file);
    if (!image) {
      return null;
    }

    if (event.imageId) {
      await this.fileService.delete(event.imageId);
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

  async findOneByUrl(url: string): Promise<EventDto> {
    const item = await this.eventsRepository.findOne<EventEntity>({
      where: { url },
    });
    return (item && this.entityToDto(item)) || null;
  }

  async findOneById(id: number): Promise<EventDto> {
    const item = await this.eventsRepository.findOne<EventEntity>({
      where: { id },
    });
    return (item && this.entityToDto(item)) || null;
  }

  async getAll(dto: GetAllArticlesDto): Promise<ListingPage<EventDto>> {
    const list = await this.eventsRepository.findAndCountAll({
      where: {
        ...(dto.categoryId && { category_id: dto.categoryId }),
      },
      order: [[dto?.sortColumn ?? 'id', dto?.sortType ?? 'DESC']],
      offset: (dto.page - 1) * dto.perPage,
      limit: dto.perPage,
    });

    return listingPage<EventDto>(
      list.rows.map((e) => this.entityToDto(e)),
      dto.page,
      list.count,
      dto.perPage,
    );
  }

  private entityToDto(event: EventEntity): EventDto {
    console.log(typeof event.end_date, typeof event.start_date);
    return {
      id: event.id,
      title: event.title,
      url: event.url,
      sponsor: event.sponsor || '',
      categoryId: event.category_id,
      text: event.text || '',
      imageId: event.image_id || 0,
      objectId: event.object_id || 0,
      address: event.address || '',
      price: event.price || 0,
      endDate: (event.end_date && dateToStr(event.end_date)) || '',
      startDate: (event.start_date && dateToStr(event.start_date)) || '',
    };
  }
}
