import {
  Controller,
  Get,
  HttpCode,
  Param,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { ListarPermissoesUseCase } from '../../../../domain/permissoes/application/use-cases/listar-permissoes'

@ApiTags('Permissões')
@ApiBearerAuth()
@Controller('/permissoes')
@UseGuards(PermissionsGuard)
export class ListarPermissoesController {
  constructor(private listarPermissoes: ListarPermissoesUseCase) {}

  @Get(':userId')
  @HttpCode(200)
  @RequirePermission('permissoes', 'access')
  @ApiOperation({
    summary:
      'Buscar permissões de um usuário (tabela + permissions_json mesclados)',
  })
  async handle(@Param('userId') userId: string) {
    return this.listarPermissoes.execute(userId)
  }
}
