import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
  NotFoundException,
  Res,
  Param,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { FileDto } from './dto/file.dto';
import type { Response } from 'express';
import { ApiFile } from 'src/core/swagger/api.file';
import { AuthGuard } from '@nestjs/passport';
import { UserRolesGuard } from '../users/roles/roles.guard';
import { HasRoles } from '../users/roles/roles.decorator';
import { UserRoleEnum } from '../users/entities/user-group.entity';

@Controller('files')
@ApiTags('Files')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), UserRolesGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('')
  @HasRoles(UserRoleEnum.admin)
  @UseInterceptors(FileInterceptor('file'))
  @ApiFile()
  @ApiConsumes('multipart/form-data')
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileDto> {
    const item = await this.filesService.add(file);
    return item.toDto();
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

    throw new NotFoundException('Could not find file by id: ' + id);
  }
}
