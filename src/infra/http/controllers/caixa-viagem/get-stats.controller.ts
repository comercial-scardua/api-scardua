import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { GetCaixaViagemStatsUseCase } from '../../../../domain/caixa-viagem/application/use-cases/get-caixa-viagem-stats'

@ApiTags('Caixa Viagem')
@ApiBearerAuth()
@Controller('/caixaviagem')
@UseGuards(PermissionsGuard)
export class GetStatsController {
  constructor(private getCaixaViagemStats: GetCaixaViagemStatsUseCase) {}

  @Get('stats')
  @HttpCode(200)
  @RequirePermission('caixaviagem', 'access')
  @ApiOperation({ summary: 'Estatísticas gerais dos caixas de viagem' })
  async handle() {
    const result = await this.getCaixaViagemStats.execute()
    return result.value!
  }
}
