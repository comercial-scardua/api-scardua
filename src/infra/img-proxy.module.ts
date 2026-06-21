import { Module } from '@nestjs/common'
import { ProxyImageUseCase } from '../domain/img-proxy/application/use-cases/proxy-image'
import { ProxyImageController } from './http/controllers/img-proxy/proxy-image.controller'

@Module({
  controllers: [ProxyImageController],
  providers: [ProxyImageUseCase],
})
export class ImgProxyModule {}
