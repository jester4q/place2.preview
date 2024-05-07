import {
  BadRequestException,
  Controller,
  Param,
  Post,
  Query,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  UseInterceptors,
  Delete,
} from '@nestjs/common';
import { ObjectsService } from './objects.service';
import { ObjectDto } from './dto/object.dto';
import { ApiFile } from 'src/core/swagger/api.file';
import { ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Objects')
@Controller('/objects/:id')
export class ObjectsImagesController {
  constructor(private readonly objectsService: ObjectsService) {}

  @Post('/logo')
  @UseInterceptors(FileInterceptor('file'))
  @ApiFile()
  @ApiConsumes('multipart/form-data')
  async uploadLogo(
    @Param('id') id: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image' })],
      }),
    )
    file: Express.Multer.File,
  ): Promise<ObjectDto> {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }
    await this.checkObject(id);

    let object;
    if (id > 0 && (object = await this.objectsService.setLogo(id, file))) {
      return object;
    }

    throw new BadRequestException('Could not add logo for object by id: ' + id);
  }

  @Post('/image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiFile()
  @ApiConsumes('multipart/form-data')
  @ApiQuery({
    name: 'orderNo',
    type: Number,
    description: 'Image position in the list (default last in list)',
    required: false,
  })
  @ApiQuery({
    name: 'main',
    type: Boolean,
    description: 'Is main image (default = false)',
    required: false,
  })
  async uploadImage(
    @Param('id') id: number,
    @Query('orderNo') orderNo: number,
    @Query('main') main: boolean,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image' })],
      }),
    )
    file: Express.Multer.File,
  ): Promise<ObjectDto> {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }
    await this.checkObject(id);
    let object;
    if (
      id > 0 &&
      (object = await this.objectsService.addImage(id, file, main, orderNo))
    ) {
      return object;
    }

    throw new BadRequestException('Could not add image to object by id: ' + id);
  }

  @Delete('/image/:imageId')
  async deleteImage(
    @Param('id') id: number,
    @Param('imageId') imageId: number,
  ): Promise<any> {
    await this.checkObject(id);
    if (id > 0 && (await this.objectsService.deleteImage(id, imageId))) {
      return {};
    }

    throw new BadRequestException('Could not find object image by id: ' + id);
  }

  private async checkObject(id: number) {
    if (!id || !(await this.objectsService.findOneById(id))) {
      throw new BadRequestException('Could not find object by id: ' + id);
    }
  }
}
