import { Module } from '@nestjs/common';
import { UploadImageController } from './upload-image.controller';

@Module({
  controllers: [UploadImageController],
})
export class UploadImageModule {}
