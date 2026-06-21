import { Module } from '@nestjs/common'
import { DownloadFileUseCase } from '../domain/download/application/use-cases/download-file'
import { DownloadFileController } from './http/controllers/download/download-file.controller'

@Module({
  controllers: [DownloadFileController],
  providers: [DownloadFileUseCase],
})
export class DownloadModule {}
