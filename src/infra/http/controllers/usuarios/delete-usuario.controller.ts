import {
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { DeleteUsuarioUseCase } from '../../../../domain/usuarios/application/use-cases/delete-usuario'

@ApiTags('Usuários')
@ApiBearerAuth()
@Controller('/usuarios')
@UseGuards(PermissionsGuard)
export class DeleteUsuarioController {
  constructor(private deleteUsuario: DeleteUsuarioUseCase) {}

  @Delete(':id')
  @HttpCode(204)
  @RequirePermission('usuarios', 'edit')
  @ApiOperation({ summary: 'Desativar usuário (soft delete)' })
  async handle(@Param('id') id: string) {
    const result = await this.deleteUsuario.execute({ usuarioId: id })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }
  }
}
