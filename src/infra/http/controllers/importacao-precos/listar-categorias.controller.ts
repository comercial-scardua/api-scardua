import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { ListarCategoriasUseCase } from '../../../../domain/importacao-precos/application/use-cases/listar-categorias'

@ApiTags('Importacao de Precos')
@ApiBearerAuth()
@Controller('/importacao-precos')
@UseGuards(PermissionsGuard)
export class ListarCategoriasController {
  constructor(private listarCategorias: ListarCategoriasUseCase) {}

  @Get('categorias')
  @HttpCode(200)
  @RequirePermission('importacao-precos', 'access')
  @ApiOperation({ summary: 'Listar categorias distintas dos produtos' })
  async handle() {
    const result = await this.listarCategorias.execute()
    return result.value!
  }
}
