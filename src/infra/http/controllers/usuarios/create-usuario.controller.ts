import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import type { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { CriarUsuarioSchema } from '../../../../domain/usuarios/application/dtos/usuario-schema'
import { CreateUsuarioUseCase } from '../../../../domain/usuarios/application/use-cases/create-usuario'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

type CreateUsuarioBody = z.infer<typeof CriarUsuarioSchema>

@ApiTags('Usuários')
@ApiBearerAuth()
@Controller('/usuarios')
@UseGuards(PermissionsGuard)
export class CreateUsuarioController {
  constructor(private createUsuario: CreateUsuarioUseCase) {}

  @Post()
  @HttpCode(201)
  @RequirePermission('usuarios', 'edit')
  @ApiOperation({ summary: 'Criar usuário' })
  @UsePipes(new ZodValidationPipe(CriarUsuarioSchema))
  async handle(@Body() body: CreateUsuarioBody) {
    const result = await this.createUsuario.execute(body)

    if (result.isLeft()) {
      throw new ConflictException(result.value.message)
    }

    return { usuarioId: result.value.usuario.id }
  }
}
