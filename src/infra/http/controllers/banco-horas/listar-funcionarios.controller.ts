import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { ListarFuncionariosBancoHorasUseCase } from '../../../../domain/banco-horas/application/use-cases/listar-funcionarios-banco-horas.use-case'

@ApiTags('Banco de Horas')
@ApiBearerAuth()
@Controller('/banco-de-horas')
@UseGuards(PermissionsGuard)
export class ListarFuncionariosController {
  constructor(
    private listarFuncionariosUseCase: ListarFuncionariosBancoHorasUseCase,
  ) {}

  @Get('funcionarios')
  @HttpCode(200)
  @RequirePermission('banco-horas', 'access')
  @ApiOperation({
    summary: 'Listar funcionários com registros no banco de horas',
  })
  async handle() {
    return this.listarFuncionariosUseCase.execute()
  }
}
