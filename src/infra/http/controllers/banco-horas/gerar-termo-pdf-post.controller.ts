import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Response,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import type { Response as ExpressResponse } from 'express'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { GerarTermoPdfUseCase } from '../../../../domain/banco-horas/application/use-cases/gerar-termo-pdf.use-case'

@ApiTags('Banco de Horas')
@ApiBearerAuth()
@Controller('/banco-de-horas')
@UseGuards(PermissionsGuard)
export class GerarTermoPdfPostController {
  constructor(private gerarTermoPdfUseCase: GerarTermoPdfUseCase) {}

  @Post('gerar-termo-pdf')
  @HttpCode(200)
  @RequirePermission('banco-horas', 'access')
  @ApiOperation({ summary: 'Gerar termo de banco de horas em PDF (via body)' })
  async handle(
    @Body() body: {
      colaboradorId: number
      dataInicio?: string
      dataFim?: string
    },
    @Response() res: ExpressResponse,
  ) {
    const { colaboradorId, dataInicio, dataFim } = body

    if (!colaboradorId)
      throw new BadRequestException('colaboradorId é obrigatório')

    try {
      const pdfStream = await this.gerarTermoPdfUseCase.execute(
        colaboradorId,
        dataInicio ? new Date(dataInicio) : undefined,
        dataFim ? new Date(dataFim) : undefined,
      )

      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="termo-banco-horas-${colaboradorId}.pdf"`,
      )

      pdfStream.pipe(res)
    } catch (error) {
      res.status(404).json({ error: (error as Error).message })
    }
  }
}
