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
import { FacilitiesService } from './facilities.service';
import { AddFacilityDto } from './dto/add.facility.dto';
import { PatchFacilityDto } from './dto/patch.facility.dto';
import { ObjectsCategoriesService } from './objects-categories.service';
import { AuthGuard } from '@nestjs/passport';
import { UserRolesGuard } from '../users/roles/roles.guard';
import { HasRoles } from '../users/roles/roles.decorator';
import { UserRoleEnum } from '../users/entities/user-group.entity';

@ApiTags('Facilities')
@Controller('/objects/categories/:categoryId/facilities')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), UserRolesGuard)
export class FacilitiesController {
  constructor(
    private readonly facilitiesService: FacilitiesService,
    private readonly categoriesService: ObjectsCategoriesService,
  ) {}

  @Get('/')
  async getAll(@Param('categoryId') categoryId: number) {
    await this.checkCategory(categoryId);
    const items = await this.facilitiesService.getAll(categoryId);
    return items.map((item) => item.toDto());
  }

  @Get('/:id')
  async getById(
    @Param('categoryId') categoryId: number,
    @Param('id') id: number,
  ) {
    //await this.checkCategory(categoryId);
    let facility;
    if (id > 0 && (facility = await this.facilitiesService.findOneById(id))) {
      return facility.toDto();
    }

    throw new NotFoundException('Could not find facility by id: ' + id);
  }

  @Post('/')
  @HasRoles(UserRoleEnum.admin)
  async add(
    @Param('categoryId') categoryId: number,
    @Body() dto: AddFacilityDto,
  ) {
    await this.checkCategory(categoryId);
    return this.facilitiesService.add(categoryId, dto);
  }

  @Patch('/:id')
  @HasRoles(UserRoleEnum.admin)
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

    throw new NotFoundException('Could not find facility by id: ' + id);
  }

  @Delete('/:id')
  @HasRoles(UserRoleEnum.admin)
  async delete(@Param('id') id: number): Promise<any> {
    if (id > 0 && (await this.facilitiesService.delete(id))) {
      return {};
    }

    throw new NotFoundException('Could not find facility by id: ' + id);
  }

  private async checkCategory(categoryId: number) {
    if (!categoryId) {
      throw new NotFoundException(
        'Could not find category by id: ' + categoryId,
      );
    }
    const category = await this.categoriesService.findOneById(categoryId);
    if (!category) {
      throw new NotFoundException(
        'Could not find category by id: ' + categoryId,
      );
    }
  }
}
