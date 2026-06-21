import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { DefinirPermissoesUseCase } from '../../../../domain/permissoes/application/use-cases/definir-permissoes'
import { UsuarioNaoEncontradoError } from '../../../../domain/permissoes/application/use-cases/errors/usuario-nao-encontrado.error'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const definirPermissoesBodySchema = z.object({
  permissions: z
    .record(
      z.string(),
      z.object({
        canAccess: z.boolean().default(false),
        canEdit: z.boolean().default(false),
        canDelete: z.boolean().default(false),
      }),
    )
    .default({}),
  restritoDepartamentos: z.array(z.string()).optional().default([]),
  relatoriosRestritoDepartamentos: z.array(z.string()).optional().default([]),
})

type DefinirPermissoesBody = z.infer<typeof definirPermissoesBodySchema>

@ApiTags('Permissões')
@ApiBearerAuth()
@Controller('/permissoes')
@UseGuards(PermissionsGuard)
export class DefinirPermissoesController {
  constructor(private definirPermissoes: DefinirPermissoesUseCase) {}

  @Put(':userId')
  @HttpCode(200)
  @RequirePermission('permissoes', 'edit')
  @ApiOperation({
    summary:
      'Definir todas as permissões de um usuário (batch upsert + salva permissions_json)',
  })
  async handle(
    @Param('userId') userId: string,
    @Body(new ZodValidationPipe(definirPermissoesBodySchema))
    body: DefinirPermissoesBody,
  ) {
    const result = await this.definirPermissoes.execute(userId, body)

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case UsuarioNaoEncontradoError:
          throw new NotFoundException(error.message)
        default:
          throw new NotFoundException(error.message)
      }
    }

    return result.value.permissions
  }
}
