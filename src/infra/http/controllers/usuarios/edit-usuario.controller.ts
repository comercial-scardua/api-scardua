import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import type { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { AtualizarUsuarioSchema } from '../../../../domain/usuarios/application/dtos/usuario-schema'
import { EditUsuarioUseCase } from '../../../../domain/usuarios/application/use-cases/edit-usuario'
import { EmailJaCadastradoError } from '../../../../domain/usuarios/application/use-cases/errors/email-ja-cadastrado.error'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

type EditUsuarioBody = z.infer<typeof AtualizarUsuarioSchema>

@ApiTags('Usuários')
@ApiBearerAuth()
@Controller('/usuarios')
@UseGuards(PermissionsGuard)
export class EditUsuarioController {
  constructor(private editUsuario: EditUsuarioUseCase) {}

  @Patch(':id')
  @HttpCode(204)
  @RequirePermission('usuarios', 'edit')
  @ApiOperation({ summary: 'Atualizar usuário' })
  async handle(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(AtualizarUsuarioSchema)) body: EditUsuarioBody,
  ) {
    const result = await this.editUsuario.execute({ usuarioId: id, data: body })

    if (result.isLeft()) {
      if (result.value instanceof EmailJaCadastradoError) {
        throw new ConflictException(result.value.message)
      }
      throw new NotFoundException(result.value.message)
    }
  }
}
