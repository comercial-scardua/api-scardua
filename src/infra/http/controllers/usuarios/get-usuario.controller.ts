import {
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { GetUsuarioUseCase } from '../../../../domain/usuarios/application/use-cases/get-usuario'

@ApiTags('Usuários')
@ApiBearerAuth()
@Controller('/usuarios')
@UseGuards(PermissionsGuard)
export class GetUsuarioController {
  constructor(private getUsuario: GetUsuarioUseCase) {}

  @Get(':id')
  @HttpCode(200)
  @RequirePermission('usuarios', 'access')
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  async handle(@Param('id') id: string) {
    const result = await this.getUsuario.execute({ usuarioId: id })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    return { usuario: result.value.usuario }
  }
}
