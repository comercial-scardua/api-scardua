import { Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { SincronizarContasUseCase } from '../../../../domain/banco-horas/application/use-cases/sincronizar-contas.use-case'

@ApiTags('Banco de Horas')
@ApiBearerAuth()
@Controller('/banco-de-horas')
@UseGuards(PermissionsGuard)
export class SincronizarContasController {
  constructor(private sincronizarContasUseCase: SincronizarContasUseCase) {}

  @Post('sincronizar')
  @HttpCode(200)
  @RequirePermission('banco-horas', 'edit')
  @ApiOperation({
    summary:
      'Sincronizar/recalcular conta corrente de horas de todos os colaboradores',
  })
  async handle() {
    return this.sincronizarContasUseCase.execute()
  }
}
