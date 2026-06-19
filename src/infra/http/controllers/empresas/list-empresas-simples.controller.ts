import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { ListEmpresasSimplesUseCase } from '../../../../domain/empresas/application/use-cases/list-empresas-simples'

@ApiTags('Empresas')
@ApiBearerAuth()
@Controller('/empresas')
@UseGuards(PermissionsGuard)
export class ListEmpresasSimplesController {
  constructor(private listEmpresasSimples: ListEmpresasSimplesUseCase) {}

  @Get('list')
  @HttpCode(200)
  @ApiOperation({ summary: 'Lista simples para dropdowns' })
  async handle() {
    const result = await this.listEmpresasSimples.execute()
    return { empresas: result.value!.empresas }
  }
}
