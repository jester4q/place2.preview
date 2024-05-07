import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Delete,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  FileTypeValidator,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ListingPage } from '../../core/page/types';
import { ArticlesCategoriesService } from './articles-categories.service';
import { GetAllArticlesDto } from './dto/get-all-articles.dto';
import { EventsService } from './events.service';
import { EventDto } from './dto/event.dto';
import { AddEventDto } from './dto/add.event.dto';
import { PatchEventDto } from './dto/patch.event.dto';
import { ApiFile } from '../../core/swagger/api.file';

@Controller('/events')
@ApiTags('Events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly categoriesService: ArticlesCategoriesService,
  ) {}

  @Get('/')
  async getAll(
    @Query() dto: GetAllArticlesDto,
  ): Promise<ListingPage<EventDto>> {
    if (dto.sortColumn) {
      const sort = dto.sortColumn;
      if (!['title', 'price', 'url'].includes(sort)) {
        throw new BadRequestException('Sort column is not valid');
      }
    }

    const list = await this.eventsService.getAll(dto);
    return list;
  }

  @Get('/:url')
  async getByUrl(@Param('url') url: string) {
    let events;
    if (url && (events = await this.eventsService.findOneByUrl(url))) {
      return events;
    }

    throw new BadRequestException('Could not find event by url: ' + url);
  }

  @Post('/')
  async add(@Body() dto: AddEventDto) {
    await this.checkCategory(dto.categoryId);
    return this.eventsService.add(dto);
  }

  @Patch('/:id')
  async patch(@Param('id') id: number, @Body() dto: PatchEventDto) {
    if (dto.categoryId) {
      await this.checkCategory(dto.categoryId);
    }
    let event;
    if (id > 0 && (event = await this.eventsService.update(id, dto))) {
      return event;
    }

    throw new BadRequestException('Could not find event by id: ' + id);
  }

  @Post('/:id/image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiFile()
  @ApiConsumes('multipart/form-data')
  async uploadFile(
    @Param('id') id: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image' })],
      }),
    )
    file: Express.Multer.File,
  ): Promise<EventDto> {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }
    let event;
    if (id > 0 && (event = await this.eventsService.setImage(id, file))) {
      return event;
    }

    throw new BadRequestException('Could not find event by id: ' + id);
  }

  @Delete('/:id')
  async delete(@Param('id') id: number): Promise<any> {
    if (id > 0 && (await this.eventsService.delete(id))) {
      return {};
    }

    throw new BadRequestException('Could not find event by id: ' + id);
  }

  private async checkCategory(categoryId: number) {
    const category = await this.categoriesService.findOneById(categoryId);
    if (!category) {
      throw new BadRequestException(
        'Could not find category by id: ' + categoryId,
      );
    }
  }
}
