import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Res,
  ServiceUnavailableException,
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import type { Response as ExpressResponse } from 'express'
import { Public } from '../../auth/decorators/public.decorator'
import { PrismaService } from '../../prisma/prisma.service'

@ApiTags('Health')
@Controller('health')
@Public()
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Verificar saúde da aplicação e conexão com banco' })
  async check(@Res() res: ExpressResponse) {
    const timestamp = new Date().toISOString()
    try {
      await this.prisma.$queryRaw`SELECT 1`
      return res.status(HttpStatus.OK).json({
        status: 'healthy',
        database: 'connected',
        timestamp,
      })
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error'
      throw new ServiceUnavailableException({
        status: 'unhealthy',
        database: 'disconnected',
        error: msg,
        timestamp,
      })
    }
  }
}
