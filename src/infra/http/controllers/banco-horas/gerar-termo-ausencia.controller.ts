import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { GerarTermoAusenciaUseCase } from '../../../../domain/banco-horas/application/use-cases/gerar-termo-ausencia.use-case'

@ApiTags('Banco de Horas')
@ApiBearerAuth()
@Controller('/banco-de-horas')
@UseGuards(PermissionsGuard)
export class GerarTermoAusenciaController {
  constructor(private gerarTermoAusenciaUseCase: GerarTermoAusenciaUseCase) {}

  @Post('gerar-termo-ausencia')
  @HttpCode(200)
  @RequirePermission('banco-horas', 'access')
  @ApiOperation({ summary: 'Gerar termo de ausência em JSON' })
  async handle(
    @Body() body: {
      colaboradorId: number
      dataInicio: string
      dataFim: string
      motivo?: string
    },
  ) {
    return this.gerarTermoAusenciaUseCase.execute(
      body.colaboradorId,
      body.dataInicio,
      body.dataFim,
      body.motivo,
    )
  }
}
