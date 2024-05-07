import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
  BadRequestException,
  Res,
  Param,
  StreamableFile,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { FileDto } from './dto/file.dto';
import type { Response } from 'express';
import { ApiFile } from 'src/core/swagger/api.file';

@Controller('files')
@ApiTags('Files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  @ApiFile()
  @ApiConsumes('multipart/form-data')
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileDto> {
    const dto = await this.filesService.add(file);
    return dto;
  }

  @Get('/:id')
  async get(
    @Param('id') id: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    let file: FileDto;
    if (id > 0 && (file = await this.filesService.findOneById(id))) {
      res.set({
        'Content-Type': file.type,
        'Content-Disposition': `attachment; filename="${file.name}"`,
      });
      return this.filesService.getStream(file);
    }

    throw new BadRequestException('Could not find file by id: ' + id);
  }
}
