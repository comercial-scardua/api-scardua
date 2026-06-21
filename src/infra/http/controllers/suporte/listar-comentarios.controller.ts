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
import { ListarComentariosUseCase } from '../../../../domain/suporte/application/use-cases/listar-comentarios'

@ApiTags('Suporte')
@ApiBearerAuth()
@Controller('/suporte')
@UseGuards(PermissionsGuard)
export class ListarComentariosController {
  constructor(private listarComentarios: ListarComentariosUseCase) {}

  @Get(':id/comentarios')
  @HttpCode(200)
  @RequirePermission('suporte', 'access')
  @ApiOperation({ summary: 'Listar comentários de um ticket' })
  async handle(@Param('id') id: string) {
    const result = await this.listarComentarios.execute(id)
    return result.value
  }
}
