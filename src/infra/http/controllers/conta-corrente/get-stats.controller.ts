import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from '../../../../auth/decorators/current-user.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import type { JwtPayload } from '../../../../auth/types/jwt-payload.type'
import { GetContaCorrenteStatsUseCase } from '../../../../domain/conta-corrente/application/use-cases/get-conta-corrente-stats'

@ApiTags('Conta Corrente')
@ApiBearerAuth()
@Controller('/conta-corrente')
@UseGuards(PermissionsGuard)
export class GetStatsController {
  constructor(private getStats: GetContaCorrenteStatsUseCase) {}

  @Get('stats')
  @HttpCode(200)
  @ApiOperation({
    summary:
      'Estatísticas de contas corrente (próprias; ?all=true para global)',
  })
  @ApiQuery({ name: 'all', required: false, type: Boolean })
  async handle(@CurrentUser() user: JwtPayload, @Query('all') all?: string) {
    const result = await this.getStats.execute({
      userId: user.userId,
      showAll: all === 'true',
    })
    return result.value
  }
}
