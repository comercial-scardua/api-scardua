import {
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Query,
  Response,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import type { Response as ExpressResponse } from 'express'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { GerarTermoPdfUseCase } from '../../../../domain/banco-horas/application/use-cases/gerar-termo-pdf.use-case'

@ApiTags('Banco de Horas')
@ApiBearerAuth()
@Controller('/banco-de-horas')
@UseGuards(PermissionsGuard)
export class GerarTermoPdfGetController {
  constructor(private gerarTermoPdfUseCase: GerarTermoPdfUseCase) {}

  @Get('termo/:colaboradorId/pdf')
  @HttpCode(200)
  @RequirePermission('banco-horas', 'access')
  @ApiOperation({ summary: 'Gerar termo de banco de horas em PDF (via query)' })
  @ApiQuery({ name: 'dataInicio', required: false, type: String })
  @ApiQuery({ name: 'dataFim', required: false, type: String })
  async handle(
    @Param('colaboradorId', ParseIntPipe) colaboradorId: number,
    @Response() res: ExpressResponse,
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
  ) {
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
