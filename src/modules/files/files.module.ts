import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { filesProviders } from './files.providers';

@Module({
  imports: [MulterModule.register({ dest: './uploads' })],
  controllers: [FilesController],
  providers: [FilesService, ...filesProviders],
  exports: [FilesService],
})
export class FilesModule {}
