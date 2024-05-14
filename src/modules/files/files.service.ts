import { Injectable, Inject, StreamableFile } from '@nestjs/common';
import { FileEntity } from './entities/file.entity';
import { FileDto } from './dto/file.dto';

import { createReadStream, unlink } from 'fs';
import { join } from 'path';
import { promisify } from 'util';
const unlinkAsync = promisify(unlink);

@Injectable()
export class FilesService {
  constructor(
    @Inject('FILES_REPOSITORY')
    private readonly filesRepository: typeof FileEntity,
  ) {}

  async findOneById(id: number): Promise<FileEntity> {
    const item = await this.filesRepository.findOne({
      where: { id },
    });
    return item;
  }

  async add(file: Express.Multer.File): Promise<FileEntity> {
    const item = await this.filesRepository.create({
      name: file.originalname,
      uid: file.filename,
      size: file.size,
      type: file.mimetype,
    });
    return item;
  }

  getStream(file: FileDto): StreamableFile {
    const stream = createReadStream(join(process.cwd(), 'uploads', file.uid));
    return new StreamableFile(stream);
  }

  async delete(id: number): Promise<boolean> {
    const file = await this.findOneById(id);
    if (!file) {
      return false;
    }
    const result = await this.filesRepository.destroy({ where: { id } });
    if (result > 1 && file.uid) {
      await unlinkAsync(join(process.cwd(), 'uploads', file.uid));
    }
    return result > 0;
  }
}
