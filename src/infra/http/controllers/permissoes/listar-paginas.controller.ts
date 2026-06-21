import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { PAGINAS } from '../../../../domain/permissoes/application/paginas.constant'

@ApiTags('Permissões')
@ApiBearerAuth()
@Controller('/permissoes')
@UseGuards(PermissionsGuard)
export class ListarPaginasController {
  @Get('paginas')
  @HttpCode(200)
  @ApiOperation({ summary: 'Listar todas as páginas disponíveis no sistema' })
  handle() {
    return { paginas: PAGINAS }
  }
}
