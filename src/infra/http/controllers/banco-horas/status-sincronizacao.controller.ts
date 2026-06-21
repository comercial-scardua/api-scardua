import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { StatusSincronizacaoUseCase } from '../../../../domain/banco-horas/application/use-cases/status-sincronizacao.use-case'

@ApiTags('Banco de Horas')
@ApiBearerAuth()
@Controller('/banco-de-horas')
@UseGuards(PermissionsGuard)
export class StatusSincronizacaoController {
  constructor(private statusSincronizacaoUseCase: StatusSincronizacaoUseCase) {}

  @Get('sincronizar')
  @HttpCode(200)
  @RequirePermission('banco-horas', 'access')
  @ApiOperation({
    summary: 'Status da sincronização de conta corrente de horas',
  })
  async handle() {
    return this.statusSincronizacaoUseCase.execute()
  }
}
