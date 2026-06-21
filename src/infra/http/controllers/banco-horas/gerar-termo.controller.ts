import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { GerarTermoBancoHorasUseCase } from '../../../../domain/banco-horas/application/use-cases/gerar-termo-banco-horas.use-case'

@ApiTags('Banco de Horas')
@ApiBearerAuth()
@Controller('/banco-de-horas')
@UseGuards(PermissionsGuard)
export class GerarTermoController {
  constructor(
    private gerarTermoBancoHorasUseCase: GerarTermoBancoHorasUseCase,
  ) {}

  @Post('gerar-termo')
  @HttpCode(200)
  @RequirePermission('banco-horas', 'access')
  @ApiOperation({ summary: 'Gerar termo de banco de horas em JSON' })
  async handle(
    @Body() body: {
      colaboradorId: number
      dataInicio?: string
      dataFim?: string
    },
  ) {
    return this.gerarTermoBancoHorasUseCase.execute(
      body.colaboradorId,
      body.dataInicio,
      body.dataFim,
    )
  }
}
