import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { ListarGruposUseCase } from '../../../../domain/importacao-precos/application/use-cases/listar-grupos'

@ApiTags('Importacao de Precos')
@ApiBearerAuth()
@Controller('/importacao-precos')
@UseGuards(PermissionsGuard)
export class ListarGruposController {
  constructor(private listarGrupos: ListarGruposUseCase) {}

  @Get('grupos')
  @HttpCode(200)
  @RequirePermission('importacao-precos', 'access')
  @ApiOperation({
    summary:
      'Listar grupos distintos dos produtos (campo nao disponivel no modelo atual)',
  })
  async handle() {
    const result = await this.listarGrupos.execute()
    return result.value!
  }
}
