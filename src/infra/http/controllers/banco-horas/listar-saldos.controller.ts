import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { ListarSaldosUseCase } from '../../../../domain/banco-horas/application/use-cases/listar-saldos.use-case'

@ApiTags('Banco de Horas')
@ApiBearerAuth()
@Controller('/banco-de-horas')
@UseGuards(PermissionsGuard)
export class ListarSaldosController {
  constructor(private listarSaldosUseCase: ListarSaldosUseCase) {}

  @Get('saldos')
  @HttpCode(200)
  @RequirePermission('banco-horas', 'access')
  @ApiOperation({ summary: 'Listar saldos de horas de todos os colaboradores' })
  async handle() {
    return this.listarSaldosUseCase.execute()
  }
}
