import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { ListarMarcasUseCase } from '../../../../domain/importacao-precos/application/use-cases/listar-marcas'

@ApiTags('Importacao de Precos')
@ApiBearerAuth()
@Controller('/importacao-precos')
@UseGuards(PermissionsGuard)
export class ListarMarcasController {
  constructor(private listarMarcas: ListarMarcasUseCase) {}

  @Get('marcas')
  @HttpCode(200)
  @RequirePermission('importacao-precos', 'access')
  @ApiOperation({
    summary:
      'Listar marcas distintas dos produtos (campo nao disponivel no modelo atual)',
  })
  async handle() {
    const result = await this.listarMarcas.execute()
    return result.value!
  }
}
