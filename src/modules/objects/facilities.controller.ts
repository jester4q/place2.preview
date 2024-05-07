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
import { FacilitiesService } from './facilities.service';
import { AddFacilityDto } from './dto/add.facility.dto';
import { PatchFacilityDto } from './dto/patch.facility.dto';
import { ObjectsCategoriesService } from './objects-categories.service';

@ApiTags('Facilities')
@Controller('/objects/categories/:categoryId/facilities')
export class FacilitiesController {
  constructor(
    private readonly facilitiesService: FacilitiesService,
    private readonly categoriesService: ObjectsCategoriesService,
  ) {}

  @Get('/')
  async getAll(@Param('categoryId') categoryId: number) {
    await this.checkCategory(categoryId);
    return this.facilitiesService.getAll(categoryId);
  }

  @Get('/:id')
  async getById(
    @Param('categoryId') categoryId: number,
    @Param('id') id: number,
  ) {
    //await this.checkCategory(categoryId);
    let facility;
    if (id > 0 && (facility = await this.facilitiesService.findOneById(id))) {
      return facility;
    }

    throw new BadRequestException('Could not find facility by id: ' + id);
  }

  @Post('/')
  async add(
    @Param('categoryId') categoryId: number,
    @Body() dto: AddFacilityDto,
  ) {
    await this.checkCategory(categoryId);
    return this.facilitiesService.add(categoryId, dto);
  }

  @Patch('/:id')
  async patch(
    @Param('categoryId') categoryId: number,
    @Param('id') id: number,
    @Body() dto: PatchFacilityDto,
  ) {
    //await this.checkCategory(categoryId);
    let facility;
    if (id > 0 && (facility = await this.facilitiesService.update(id, dto))) {
      return facility;
    }

    throw new BadRequestException('Could not find facility by id: ' + id);
  }

  @Delete('/:id')
  async delete(@Param('id') id: number): Promise<any> {
    if (id > 0 && (await this.facilitiesService.delete(id))) {
      return {};
    }

    throw new BadRequestException('Could not find facility by id: ' + id);
  }

  private async checkCategory(categoryId: number) {
    if (!categoryId) {
      throw new BadRequestException(
        'Could not find category by id: ' + categoryId,
      );
    }
    const category = await this.categoriesService.findOneById(categoryId);
    if (!category) {
      throw new BadRequestException(
        'Could not find category by id: ' + categoryId,
      );
    }
  }
}
