import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ObjectsReviewsService } from './reviews.service';
import { PatchObjectReviewDto } from './dto/patch.object-review.dto';
import { AddObjectReviewDto } from './dto/add.object-review.dto';
import { ObjectsService } from './objects.service';
import { AuthGuard } from '@nestjs/passport';
import { UserRolesGuard } from '../users/roles/roles.guard';
import { HasRoles } from '../users/roles/roles.decorator';
import { UserRoleEnum } from '../users/entities/user-group.entity';

@ApiTags('Object reviews')
@Controller('/objects/:objectId/reviews')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), UserRolesGuard)
export class ObjectsReviewsController {
  constructor(
    private readonly reviewsService: ObjectsReviewsService,
    private readonly objectsService: ObjectsService,
  ) {}

  @Get('/')
  async getAll(@Param('objectId') objectId: number) {
    await this.checkObject(objectId);
    const items = await this.reviewsService.getAll(objectId);

    return items.map((item) => item.toDto());
  }

  @Get('/:id')
  async getById(@Param('objectId') objectId: number, @Param('id') id: number) {
    let review;
    if (id > 0 && (review = await this.reviewsService.findOneById(id))) {
      return review.toDto();
    }

    throw new NotFoundException('Could not find review by id: ' + id);
  }

  @Post('/')
  @HasRoles(UserRoleEnum.admin)
  async add(
    @Param('objectId') objectId: number,
    @Body() dto: AddObjectReviewDto,
  ) {
    await this.checkObject(objectId);
    const item = await this.reviewsService.add(objectId, dto);

    return item.toDto();
  }

  @Patch('/:id')
  @HasRoles(UserRoleEnum.admin)
  async patch(
    @Param('objectId') objectId: number,
    @Param('id') id: number,
    @Body() dto: PatchObjectReviewDto,
  ) {
    // await this.checkObject(objectId);
    let review;
    if (id > 0 && (review = await this.reviewsService.update(id, dto))) {
      return review.toDto();
    }

    throw new NotFoundException('Could not find review by id: ' + id);
  }

  @Delete('/:id')
  @HasRoles(UserRoleEnum.admin)
  async delete(
    @Param('objectId') objectId: number,
    @Param('id') id: number,
  ): Promise<any> {
    if (id > 0 && (await this.reviewsService.delete(id))) {
      return {};
    }

    throw new NotFoundException('Could not find review by id: ' + id);
  }

  private async checkObject(id: number) {
    if (!id || !(await this.objectsService.findOneById(id))) {
      throw new NotFoundException('Could not find object by id: ' + id);
    }
  }
}
