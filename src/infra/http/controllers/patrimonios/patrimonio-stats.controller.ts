import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { GetPatrimonioStatsUseCase } from '../../../../domain/patrimonios/application/use-cases/get-patrimonio-stats'

@ApiTags('Patrimônios')
@ApiBearerAuth()
@Controller('/patrimonio')
@UseGuards(PermissionsGuard)
export class PatrimonioStatsController {
  constructor(private getStats: GetPatrimonioStatsUseCase) {}

  @Get('stats')
  @HttpCode(200)
  @RequirePermission('patrimonio', 'access')
  @ApiOperation({
    summary: 'Estatísticas por tipo, setor e movimentações por mês',
  })
  async handle() {
    const result = await this.getStats.execute()
    return result.value!
  }
}
