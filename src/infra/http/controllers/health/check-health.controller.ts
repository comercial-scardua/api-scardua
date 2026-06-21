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
import { Public } from '../../../../auth/decorators/public.decorator'
import { CheckHealthUseCase } from '../../../../domain/health/application/use-cases/check-health'

@ApiTags('Health')
@Controller('health')
@Public()
export class CheckHealthController {
  constructor(private checkHealth: CheckHealthUseCase) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Verificar saúde da aplicação e conexão com banco' })
  async handle(@Res() res: ExpressResponse) {
    const result = await this.checkHealth.execute()

    if (result.isLeft()) {
      throw new ServiceUnavailableException(result.value)
    }

    return res.status(HttpStatus.OK).json(result.value)
  }
}
