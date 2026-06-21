import { Module } from '@nestjs/common'
import { UploadImageUseCase } from '../domain/upload-image/application/use-cases/upload-image'
import { UploadImageController } from './http/controllers/upload-image/upload-image.controller'

@Module({
  controllers: [UploadImageController],
  providers: [UploadImageUseCase],
})
export class UploadImageModule {}
