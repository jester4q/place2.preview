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
import { ObjectsTariffsService } from './tariffs.service';
import { AddObjectTariffDto } from './dto/add.object-tariff.dto';
import { PatchObjectTariffDto } from './dto/patch.object-tariff.dto';
import { ObjectsService } from './objects.service';
import { TariffsCategoriesService } from './tariffs-categories.service';
import { ObjectDto } from './dto/object.dto';

@ApiTags('Objects tariffs')
@Controller('/objects/:objectId/tariffs')
export class ObjectsTariffsController {
  constructor(
    private readonly tariffsService: ObjectsTariffsService,
    private readonly tariffsCategoriesService: TariffsCategoriesService,
    private readonly objectsService: ObjectsService,
  ) {}

  @Get('/')
  async getAll(@Param('objectId') objectId: number) {
    await this.checkObject(objectId);
    return this.tariffsService.getAll(objectId);
  }

  @Get('/:id')
  async getById(@Param('objectId') objectId: number, @Param('id') id: number) {
    let tariff;
    if (id > 0 && (tariff = await this.tariffsService.findOneById(id))) {
      return tariff;
    }

    throw new BadRequestException('Could not find tariff by id: ' + id);
  }

  @Post('/')
  async add(
    @Param('objectId') objectId: number,
    @Body() dto: AddObjectTariffDto,
  ) {
    const object = await this.checkObject(objectId);
    await this.checkTariffCategory(object.categoryId, dto.tariffCategoryId);
    return this.tariffsService.add(objectId, dto);
  }

  @Patch('/:id')
  async patch(
    @Param('objectId') objectId: number,
    @Param('id') id: number,
    @Body() dto: PatchObjectTariffDto,
  ) {
    const object = await this.checkObject(objectId);
    await this.checkTariffCategory(object.categoryId, dto.tariffCategoryId);
    let tariff;
    if (id > 0 && (tariff = await this.tariffsService.update(id, dto))) {
      return tariff;
    }

    throw new BadRequestException('Could not find tariff by id: ' + id);
  }

  @Delete('/:id')
  async delete(
    @Param('objectId') objectId: number,
    @Param('id') id: number,
  ): Promise<any> {
    if (id > 0 && (await this.tariffsService.delete(id))) {
      return {};
    }

    throw new BadRequestException('Could not find tariff by id: ' + id);
  }

  private async checkObject(id: number): Promise<ObjectDto> {
    let object;
    if (id && (object = await this.objectsService.findOneById(id))) {
      return object;
    }
    throw new BadRequestException('Could not find object by id: ' + id);
  }

  private async checkTariffCategory(categoryId: number, tariffCategoryId) {
    if (!tariffCategoryId || !categoryId) {
      throw new BadRequestException(
        'Could not find tariff category by id: ' + tariffCategoryId,
      );
    }
    const categoriesIds = (
      await this.tariffsCategoriesService.findForCategory(categoryId)
    ).map((item) => item.id);

    if (!categoriesIds.includes(tariffCategoryId)) {
      throw new BadRequestException(
        'Could not find tariff category by id: ' +
          tariffCategoryId +
          ' for selected object',
      );
    }
  }
}
