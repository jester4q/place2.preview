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
import { ObjectsCategoriesService } from './objects-categories.service';
import { TariffsCategoriesService } from './tariffs-categories.service';
import { AddTariffCategoryDto } from './dto/add.tariff-category.dto';
import { PatchTariffCategoryDto } from './dto/patch.tariff-category.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserRolesGuard } from '../users/roles/roles.guard';
import { HasRoles } from '../users/roles/roles.decorator';
import { UserRoleEnum } from '../users/entities/user-group.entity';

@ApiTags('Tariff categories')
@Controller('/objects/categories/:categoryId/tariffs-categories')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), UserRolesGuard)
export class TariffsCategoriesController {
  constructor(
    private readonly tariffsCategoriesService: TariffsCategoriesService,
    private readonly categoriesService: ObjectsCategoriesService,
  ) {}

  @Get('/')
  async getAll(@Param('categoryId') categoryId: number) {
    await this.checkCategory(categoryId);
    const items = await this.tariffsCategoriesService.getAll(categoryId);

    return items.map((item) => item.toDto());
  }

  @Get('/:id')
  async getById(
    @Param('categoryId') categoryId: number,
    @Param('id') id: number,
  ) {
    //await this.checkCategory(categoryId);
    let cat;
    if (id > 0 && (cat = await this.tariffsCategoriesService.findOneById(id))) {
      return cat.toDto();
    }

    throw new NotFoundException('Could not find tariff category by id: ' + id);
  }

  @Post('/')
  @HasRoles(UserRoleEnum.admin)
  async add(
    @Param('categoryId') categoryId: number,
    @Body() dto: AddTariffCategoryDto,
  ) {
    await this.checkCategory(categoryId);
    const item = await this.tariffsCategoriesService.add(categoryId, dto);

    return item.toDto();
  }

  @Patch('/:id')
  @HasRoles(UserRoleEnum.admin)
  async patch(
    @Param('categoryId') categoryId: number,
    @Param('id') id: number,
    @Body() dto: PatchTariffCategoryDto,
  ) {
    //await this.checkCategory(categoryId);
    let cat;
    if (id > 0 && (cat = await this.tariffsCategoriesService.update(id, dto))) {
      return cat.toDto();
    }

    throw new NotFoundException('Could not find tariff category by id: ' + id);
  }

  @Delete('/:id')
  @HasRoles(UserRoleEnum.admin)
  async delete(@Param('id') id: number): Promise<any> {
    if (id > 0 && (await this.tariffsCategoriesService.delete(id))) {
      return {};
    }

    throw new NotFoundException('Could not find tariff category by id: ' + id);
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
