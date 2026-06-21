import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { FetchEmpresasEstoqueUseCase } from '../../../../domain/estoque/application/use-cases/fetch-empresas-estoque'

@ApiTags('Estoque')
@ApiBearerAuth()
@Controller('/estoque')
@UseGuards(PermissionsGuard)
export class FetchEmpresasEstoqueController {
  constructor(private fetchEmpresas: FetchEmpresasEstoqueUseCase) {}

  @Get('empresas')
  @HttpCode(200)
  @RequirePermission('estoque', 'access')
  @ApiOperation({
    summary: 'Listar empresas disponíveis para movimentações de estoque',
  })
  async handle() {
    const result = await this.fetchEmpresas.execute()
    return result.value
  }
}
