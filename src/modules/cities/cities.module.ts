import { Module } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CitiesController } from './cities.controller';
import { citiesProviders } from './cities.providers';

@Module({
  imports: [],
  controllers: [CitiesController],
  providers: [CitiesService, ...citiesProviders],
  exports: [CitiesService],
})
export class CitiesModule {}
