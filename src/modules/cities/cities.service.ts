import { Inject, Injectable } from '@nestjs/common';
import { CityEntity } from './entities/city.entity';
import { CityDto } from './dto/city.dto';

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

  async getAll(): Promise<CityDto[]> {
    return (await this.citiesRepository.findAll()).map((item) =>
      this.entityToDto(item),
    );
  }

  async findOneByUrl(url: string): Promise<CityDto> {
    const item = await this.citiesRepository.findOne({
      where: { url },
    });
    return (item && this.entityToDto(item)) || null;
  }

  async findOneById(id: number): Promise<CityDto> {
    const item = await this.citiesRepository.findOne({
      where: { id },
    });
    return (item && this.entityToDto(item)) || null;
  }

  async add(city: City): Promise<CityDto> {
    const item = await this.citiesRepository.create({
      name: city.name,
      url: city.url,
    });
    return this.entityToDto(item);
  }

  async update(id: number, city: Partial<City>): Promise<CityDto | null> {
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

  private entityToDto(city: CityEntity): CityDto {
    return {
      id: city.id,
      name: city.name,
      url: city.url,
    };
  }
}
