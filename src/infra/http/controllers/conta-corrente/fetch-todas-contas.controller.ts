import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { FetchAllContasUseCase } from '../../../../domain/conta-corrente/application/use-cases/fetch-all-contas'

@ApiTags('Conta Corrente')
@ApiBearerAuth()
@Controller('/conta-corrente')
@UseGuards(PermissionsGuard)
export class FetchTodasContasController {
  constructor(private fetchAllContas: FetchAllContasUseCase) {}

  @Get('todos')
  @HttpCode(200)
  @RequirePermission('contacorrentetodos', 'access')
  @ApiOperation({
    summary: 'Listar todas as contas (admin/permissão especial)',
  })
  @ApiQuery({ name: 'showHidden', required: false, type: Boolean })
  async handle(@Query('showHidden') showHidden?: boolean) {
    const result = await this.fetchAllContas.execute({ showHidden })
    return result.value.contas
  }
}
