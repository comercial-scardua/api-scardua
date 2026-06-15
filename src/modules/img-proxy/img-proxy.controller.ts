import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  Query,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import type { Response as ExpressResponse } from 'express';
import { Public } from '../../auth/decorators/public.decorator';

@ApiTags('Img Proxy')
@Controller('img-proxy')
@Public()
export class ImgProxyController {
  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Proxy de imagens externas (somente HTTPS, sem localhost)' })
  @ApiQuery({ name: 'url', required: true, description: 'URL da imagem (deve começar com https://)' })
  async proxy(
    @Query('url') url: string,
    @Res() res: ExpressResponse,
  ) {
    if (!url) {
      throw new BadRequestException('Parâmetro url é obrigatório');
    }

    if (!url.startsWith('https://')) {
      throw new BadRequestException('Apenas URLs HTTPS são permitidas');
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      throw new BadRequestException('URL inválida');
    }

    const hostname = parsedUrl.hostname.toLowerCase();
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '::1' ||
      hostname.endsWith('.local')
    ) {
      throw new BadRequestException('URLs de localhost não são permitidas');
    }

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new InternalServerErrorException(
          `Falha ao buscar imagem: ${response.status} ${response.statusText}`,
        );
      }

      const contentType = response.headers.get('content-type') ?? 'image/jpeg';
      const buffer = Buffer.from(await response.arrayBuffer());

      res.set('Content-Type', contentType);
      res.set('Cache-Control', 'public, max-age=86400');
      return res.send(buffer);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof InternalServerErrorException) {
        throw error;
      }
      const msg = error instanceof Error ? error.message : 'Erro ao buscar imagem';
      throw new InternalServerErrorException(msg);
    }
  }
}
