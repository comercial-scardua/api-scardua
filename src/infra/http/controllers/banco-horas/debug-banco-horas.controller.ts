import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { DebugBancoHorasUseCase } from '../../../../domain/banco-horas/application/use-cases/debug-banco-horas.use-case'

@ApiTags('Banco de Horas')
@ApiBearerAuth()
@Controller('/banco-de-horas')
@UseGuards(PermissionsGuard)
export class DebugBancoHorasController {
  constructor(private debugBancoHorasUseCase: DebugBancoHorasUseCase) {}

  @Get('debug')
  @HttpCode(200)
  @RequirePermission('banco-horas', 'access')
  @ApiOperation({ summary: 'Diagnóstico do banco de horas' })
  async handle() {
    return this.debugBancoHorasUseCase.execute()
  }
}
