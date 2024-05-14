import { Inject, Injectable } from '@nestjs/common';
import { CityEntity } from './entities/city.entity';

type City = {
  name: string;
  url: string;
};

@Injectable()
export class CitiesService {
  constructor(
    @Inject('CITIES_REPOSITORY')
    private readonly citiesRepository: typeof CityEntity,
  ) {}

  async getAll(): Promise<CityEntity[]> {
    return await this.citiesRepository.findAll();
  }

  async findOneByUrl(url: string): Promise<CityEntity> {
    const item = await this.citiesRepository.findOne({
      where: { url },
    });
    return item;
  }

  async findOneById(id: number): Promise<CityEntity> {
    const item = await this.citiesRepository.findOne({
      where: { id },
    });
    return item;
  }

  async add(city: City): Promise<CityEntity> {
    const item = await this.citiesRepository.create({
      name: city.name,
      url: city.url,
    });
    return item;
  }

  async update(id: number, city: Partial<City>): Promise<CityEntity> {
    const result = await this.citiesRepository.update<CityEntity>(
      {
        name: city.name,
        url: city.url,
      },
      {
        where: {
          id,
        },
      },
    );
    if (result.length && result[0] > 0) {
      return this.findOneById(id);
    }

    return null;
  }
}
