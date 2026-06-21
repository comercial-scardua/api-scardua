import {
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { ObterSaldoHorasUseCase } from '../../../../domain/banco-horas/application/use-cases/obter-saldo-horas.use-case'

@ApiTags('Banco de Horas')
@ApiBearerAuth()
@Controller('/banco-de-horas')
@UseGuards(PermissionsGuard)
export class ObterSaldoHorasController {
  constructor(private obterSaldoUseCase: ObterSaldoHorasUseCase) {}

  @Get('saldo/:colaboradorId')
  @HttpCode(200)
  @RequirePermission('banco-horas', 'access')
  @ApiOperation({ summary: 'Obter saldo de horas do colaborador' })
  async handle(@Param('colaboradorId', ParseIntPipe) colaboradorId: number) {
    return this.obterSaldoUseCase.execute(colaboradorId)
  }
}
