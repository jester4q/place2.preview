import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CitiesService } from './cities.service';
import { AddCityDto } from './dto/add.city.dto';
import { PatchCityDto } from './dto/patch.city.dto';

@ApiTags('Cities')
@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Get('/')
  getAll() {
    return this.citiesService.getAll();
  }

  @Get('/:url')
  async getByUrl(@Param('url') url: string) {
    let city;
    if (url && (city = await this.citiesService.findOneByUrl(url))) {
      return city;
    }

    throw new BadRequestException('Could not find city by url: ' + url);
  }

  @Post('/')
  async add(@Body() dto: AddCityDto) {
    return this.citiesService.add(dto);
  }

  @Patch('/:id')
  async patch(@Param('id') id: number, @Body() dto: PatchCityDto) {
    let city;
    if (id > 0 && (city = await this.citiesService.update(id, dto))) {
      return city;
    }

    throw new BadRequestException('Could not find city by id: ' + id);
  }
}
