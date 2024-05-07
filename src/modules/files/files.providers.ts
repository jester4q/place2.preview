import { FileEntity } from './entities/file.entity';

export const filesProviders = [
  {
    provide: 'FILES_REPOSITORY',
    useValue: FileEntity,
  },
];
