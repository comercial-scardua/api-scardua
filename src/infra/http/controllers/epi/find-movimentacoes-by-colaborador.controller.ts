import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { EpiRepository } from '../../../../domain/epi/application/repositories/epi-repository'

@ApiTags('EPI')
@ApiBearerAuth()
@Controller('/epi')
@UseGuards(PermissionsGuard)
export class FindMovimentacoesByColaboradorController {
  constructor(private repo: EpiRepository) {}

  @Get('movimentacoes/colaborador/:id')
  @RequirePermission('epi', 'access')
  @ApiOperation({ summary: 'Histórico de movimentações do colaborador' })
  handle(@Param('id', ParseIntPipe) id: number) {
    return this.repo.findMovimentacoesByColaborador(id)
  }
}
