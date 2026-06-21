import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  Query,
  Res,
} from '@nestjs/common'
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import type { Response as ExpressResponse } from 'express'
import { Public } from '../../../../auth/decorators/public.decorator'
import { ProxyImageUseCase } from '../../../../domain/img-proxy/application/use-cases/proxy-image'

@ApiTags('Img Proxy')
@Controller('img-proxy')
@Public()
export class ProxyImageController {
  constructor(private proxyImage: ProxyImageUseCase) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Proxy de imagens externas (somente HTTPS, sem localhost)',
  })
  @ApiQuery({
    name: 'url',
    required: true,
    description: 'URL da imagem (deve começar com https://)',
  })
  async handle(@Query('url') url: string, @Res() res: ExpressResponse) {
    const result = await this.proxyImage.execute({ url })

    if (result.isLeft()) {
      const msg = result.value.message
      if (
        msg.startsWith('Falha ao buscar imagem') ||
        msg === 'Erro ao buscar imagem'
      ) {
        throw new InternalServerErrorException(msg)
      }
      throw new BadRequestException(msg)
    }

    res.set('Content-Type', result.value.contentType)
    res.set('Cache-Control', 'public, max-age=86400')
    return res.send(result.value.buffer)
  }
}
