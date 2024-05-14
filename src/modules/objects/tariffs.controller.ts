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
import { ObjectsTariffsService } from './tariffs.service';
import { AddObjectTariffDto } from './dto/add.object-tariff.dto';
import { PatchObjectTariffDto } from './dto/patch.object-tariff.dto';
import { ObjectsService } from './objects.service';
import { TariffsCategoriesService } from './tariffs-categories.service';
import { ObjectDto } from './dto/object.dto';
import { FacilitiesService } from './facilities.service';
import { AuthGuard } from '@nestjs/passport';
import { UserRolesGuard } from '../users/roles/roles.guard';
import { HasRoles } from '../users/roles/roles.decorator';
import { UserRoleEnum } from '../users/entities/user-group.entity';

@ApiTags('Objects tariffs')
@Controller('/objects/:objectId/tariffs')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), UserRolesGuard)
export class ObjectsTariffsController {
  constructor(
    private readonly tariffsService: ObjectsTariffsService,
    private readonly tariffsCategoriesService: TariffsCategoriesService,
    private readonly facilitiesService: FacilitiesService,
    private readonly objectsService: ObjectsService,
  ) {}

  @Get('/')
  async getAll(@Param('objectId') objectId: number) {
    await this.checkObject(objectId);
    const items = await this.tariffsService.getAll(objectId);
    return items.map((item) => item.toDto());
  }

  @Get('/:id')
  async getById(@Param('objectId') objectId: number, @Param('id') id: number) {
    let tariff;
    if (id > 0 && (tariff = await this.tariffsService.findOneById(id))) {
      return tariff.toDto();
    }

    throw new NotFoundException('Could not find tariff by id: ' + id);
  }

  @Post('/')
  @HasRoles(UserRoleEnum.admin)
  async add(
    @Param('objectId') objectId: number,
    @Body() dto: AddObjectTariffDto,
  ) {
    const object = await this.checkObject(objectId);
    await this.checkTariffCategory(object.categoryId, dto.tariffCategoryId);
    if (dto.facilitiesIds) {
      await this.checkFacilities(object.categoryId, dto.facilitiesIds);
    }
    const item = await this.tariffsService.add(objectId, dto);
    return item.toDto();
  }

  @Patch('/:id')
  @HasRoles(UserRoleEnum.admin)
  async patch(
    @Param('objectId') objectId: number,
    @Param('id') id: number,
    @Body() dto: PatchObjectTariffDto,
  ) {
    const object = await this.checkObject(objectId);
    if (dto.tariffCategoryId) {
      await this.checkTariffCategory(object.categoryId, dto.tariffCategoryId);
    }
    if (dto.facilitiesIds) {
      await this.checkFacilities(object.categoryId, dto.facilitiesIds);
    }
    let tariff;
    if (id > 0 && (tariff = await this.tariffsService.update(id, dto))) {
      return tariff.toDto();
    }

    throw new NotFoundException('Could not find tariff by id: ' + id);
  }

  @Delete('/:id')
  @HasRoles(UserRoleEnum.admin)
  async delete(
    @Param('objectId') objectId: number,
    @Param('id') id: number,
  ): Promise<any> {
    if (id > 0 && (await this.tariffsService.delete(id))) {
      return {};
    }

    throw new NotFoundException('Could not find tariff by id: ' + id);
  }

  private async checkObject(id: number): Promise<ObjectDto> {
    let object;
    if (id && (object = await this.objectsService.findOneById(id))) {
      return object.toDto();
    }
    throw new NotFoundException('Could not find object by id: ' + id);
  }

  private async checkTariffCategory(categoryId: number, tariffCategoryId) {
    if (!tariffCategoryId || !categoryId) {
      throw new NotFoundException(
        'Could not find tariff category by id: ' + tariffCategoryId,
      );
    }
    const categoriesIds = (
      await this.tariffsCategoriesService.findForCategory(categoryId)
    ).map((item) => item.id);

    if (!categoriesIds.includes(tariffCategoryId)) {
      throw new NotFoundException(
        'Could not find tariff category by id: ' +
          tariffCategoryId +
          ' for selected object',
      );
    }
  }

  private async checkFacilities(categoryId: number, facilitiesIds: number[]) {
    const allowFacilities = (
      await this.facilitiesService.findForCategory(categoryId)
    ).map((item) => item.id);

    facilitiesIds.forEach((id) => {
      if (!allowFacilities.includes(id)) {
        throw new NotFoundException('Could not find facility by id: ' + id);
      }
    });
  }
}
