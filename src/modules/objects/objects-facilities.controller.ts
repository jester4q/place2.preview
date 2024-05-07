import {
  BadRequestException,
  Controller,
  Param,
  Post,
  Body,
} from '@nestjs/common';
import { ObjectsService } from './objects.service';
import { ObjectDto } from './dto/object.dto';
import { ApiTags } from '@nestjs/swagger';
import { ObjectFacilitiesDto } from './dto/object.facilities.dto';
import { FacilitiesService } from './facilities.service';

@ApiTags('Objects')
@Controller('/objects/:id')
export class ObjectsFacilitiesController {
  constructor(
    private readonly objectsService: ObjectsService,
    private readonly facilitiesService: FacilitiesService,
  ) {}

  @Post('/facility')
  async setFacility(
    @Param('id') id: number,
    @Body() body: ObjectFacilitiesDto,
  ): Promise<ObjectDto> {
    let object;
    if (!id || !(object = await this.objectsService.findOneById(id))) {
      throw new BadRequestException('Could not find object by id: ' + id);
    }

    const allowFacilities = (
      await this.facilitiesService.findForCategory(object.categoryId)
    ).map((item) => item.id);

    body.items.forEach((id) => {
      if (!allowFacilities.includes(id)) {
        throw new BadRequestException('Could not find facility by id: ' + id);
      }
    });

    return this.objectsService.setFacilities(id, body.items);
  }
}
