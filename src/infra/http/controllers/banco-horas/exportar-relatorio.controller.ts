import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { GerarRelatorioUseCase } from '../../../../domain/banco-horas/application/use-cases/gerar-relatorio.use-case'

@ApiTags('Banco de Horas')
@ApiBearerAuth()
@Controller('/banco-de-horas')
@UseGuards(PermissionsGuard)
export class ExportarRelatorioController {
  constructor(private gerarRelatorioUseCase: GerarRelatorioUseCase) {}

  @Post('exportar-relatorio')
  @HttpCode(200)
  @RequirePermission('banco-horas', 'access')
  @ApiOperation({ summary: 'Exportar relatório de horas com filtros via body' })
  async handle(
    @Body()
    body: { colaboradorId?: number; dataInicio?: string; dataFim?: string },
  ): Promise<any> {
    return this.gerarRelatorioUseCase.execute(
      body.dataInicio ? new Date(body.dataInicio) : undefined,
      body.dataFim ? new Date(body.dataFim) : undefined,
      body.colaboradorId,
    )
  }
}
