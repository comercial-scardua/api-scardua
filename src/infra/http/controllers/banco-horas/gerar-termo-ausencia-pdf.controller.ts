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
import { PrismaService } from '../../../../prisma/prisma.service'

@ApiTags('Banco de Horas')
@ApiBearerAuth()
@Controller('/banco-de-horas')
@UseGuards(PermissionsGuard)
export class GerarTermoAusenciaPdfController {
  constructor(
    private gerarTermoPdfUseCase: GerarTermoPdfUseCase,
    private prisma: PrismaService,
  ) {}

  @Post('gerar-termo-ausencia-pdf')
  @HttpCode(200)
  @RequirePermission('banco-horas', 'access')
  @ApiOperation({ summary: 'Gerar termo de ausência em PDF' })
  async handle(
    @Body() body: {
      colaboradorId: number
      dataInicio: string
      dataFim: string
      motivo?: string
    },
    @Response() res: ExpressResponse,
  ) {
    const { colaboradorId, dataInicio, dataFim } = body

    if (!colaboradorId || !dataInicio || !dataFim) {
      throw new BadRequestException(
        'colaboradorId, dataInicio e dataFim são obrigatórios',
      )
    }

    const colaborador = await this.prisma.colaboradores.findUnique({
      where: { id: colaboradorId },
    })

    if (!colaborador) {
      res
        .status(404)
        .json({ error: `Colaborador #${colaboradorId} não encontrado` })
      return
    }

    try {
      const pdfStream = await this.gerarTermoPdfUseCase.execute(
        colaboradorId,
        new Date(dataInicio),
        new Date(dataFim),
      )

      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="termo-ausencia-${colaboradorId}.pdf"`,
      )

      pdfStream.pipe(res)
    } catch (error) {
      res.status(500).json({ error: (error as Error).message })
    }
  }
}
