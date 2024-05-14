import {
  NotFoundException,
  Controller,
  Param,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ObjectsService } from './objects.service';
import { ObjectDto } from './dto/object.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ObjectFacilitiesDto } from './dto/object.facilities.dto';
import { FacilitiesService } from './facilities.service';
import { AuthGuard } from '@nestjs/passport';
import { UserRolesGuard } from '../users/roles/roles.guard';
import { HasRoles } from '../users/roles/roles.decorator';
import { UserRoleEnum } from '../users/entities/user-group.entity';

@ApiTags('Objects')
@Controller('/objects/:id')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), UserRolesGuard)
export class ObjectsFacilitiesController {
  constructor(
    private readonly objectsService: ObjectsService,
    private readonly facilitiesService: FacilitiesService,
  ) {}

  @Post('/facility')
  @HasRoles(UserRoleEnum.admin)
  async setFacility(
    @Param('id') id: number,
    @Body() body: ObjectFacilitiesDto,
  ): Promise<ObjectDto> {
    let object;
    if (!id || !(object = await this.objectsService.findOneById(id))) {
      throw new NotFoundException('Could not find object by id: ' + id);
    }

    const allowFacilities = (
      await this.facilitiesService.findForCategory(object.categoryId)
    ).map((item) => item.id);

    body.items.forEach((id) => {
      if (!allowFacilities.includes(id)) {
        throw new NotFoundException('Could not find facility by id: ' + id);
      }
    });

    const item = await this.objectsService.setFacilities(id, body.items);
    return item.toDto();
  }
}
