import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { ListGestoresEmpresasUseCase } from '../../../../domain/gestor-empresas/application/use-cases/list-gestores-empresas'

@ApiTags('Gestor Empresas')
@ApiBearerAuth()
@Controller('/gestor-empresas')
@UseGuards(PermissionsGuard)
export class ListGestoresEmpresasController {
  constructor(private listGestoresEmpresas: ListGestoresEmpresasUseCase) {}

  @Get()
  @HttpCode(200)
  @RequirePermission('gestor-empresas', 'access')
  @ApiOperation({ summary: 'Listar gestores de empresas' })
  @ApiQuery({ name: 'empresaId', required: false, type: Number })
  @ApiQuery({ name: 'colaboradorId', required: false, type: Number })
  async handle(
    @Query('empresaId') empresaId?: string,
    @Query('colaboradorId') colaboradorId?: string,
  ) {
    const result = await this.listGestoresEmpresas.execute({
      empresaId: empresaId ? Number.parseInt(empresaId, 10) : undefined,
      colaboradorId: colaboradorId
        ? Number.parseInt(colaboradorId, 10)
        : undefined,
    })

    return result.value?.gestores
  }
}
