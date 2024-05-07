import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ObjectsReviewsService } from './reviews.service';
import { PatchObjectReviewDto } from './dto/patch.object-review.dto';
import { AddObjectReviewDto } from './dto/add.object-review.dto';
import { ObjectsService } from './objects.service';

@ApiTags('Object reviews')
@Controller('/objects/:objectId/reviews')
export class ObjectsReviewsController {
  constructor(
    private readonly reviewsService: ObjectsReviewsService,
    private readonly objectsService: ObjectsService,
  ) {}

  @Get('/')
  async getAll(@Param('objectId') objectId: number) {
    await this.checkObject(objectId);
    return this.reviewsService.getAll(objectId);
  }

  @Get('/:id')
  async getById(@Param('objectId') objectId: number, @Param('id') id: number) {
    let review;
    if (id > 0 && (review = await this.reviewsService.findOneById(id))) {
      return review;
    }

    throw new BadRequestException('Could not find review by id: ' + id);
  }

  @Post('/')
  async add(
    @Param('objectId') objectId: number,
    @Body() dto: AddObjectReviewDto,
  ) {
    await this.checkObject(objectId);
    return this.reviewsService.add(objectId, dto);
  }

  @Patch('/:id')
  async patch(
    @Param('objectId') objectId: number,
    @Param('id') id: number,
    @Body() dto: PatchObjectReviewDto,
  ) {
    // await this.checkObject(objectId);
    let review;
    if (id > 0 && (review = await this.reviewsService.update(id, dto))) {
      return review;
    }

    throw new BadRequestException('Could not find review by id: ' + id);
  }

  @Delete('/:id')
  async delete(
    @Param('objectId') objectId: number,
    @Param('id') id: number,
  ): Promise<any> {
    if (id > 0 && (await this.reviewsService.delete(id))) {
      return {};
    }

    throw new BadRequestException('Could not find review by id: ' + id);
  }

  private async checkObject(id: number) {
    if (!id || !(await this.objectsService.findOneById(id))) {
      throw new BadRequestException('Could not find object by id: ' + id);
    }
  }
}
