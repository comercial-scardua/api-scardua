import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { CurrentUser } from '../../../../auth/decorators/current-user.decorator'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import type { JwtPayload } from '../../../../auth/types/jwt-payload.type'
import { CheckUsuarioPermissionUseCase } from '../../../../domain/usuarios/application/use-cases/check-usuario-permission'
import { CheckUsuarioPermissionDebugUseCase } from '../../../../domain/usuarios/application/use-cases/check-usuario-permission-debug'
import { GetUsuarioPermissionsUseCase } from '../../../../domain/usuarios/application/use-cases/get-usuario-permissions'
import { SetUsuarioPermissionUseCase } from '../../../../domain/usuarios/application/use-cases/set-usuario-permission'
import { UpdateUsuarioPermissionsUseCase } from '../../../../domain/usuarios/application/use-cases/update-usuario-permissions'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const setPermissionBodySchema = z.object({
  userId: z.string(),
  page: z.string(),
  canAccess: z.boolean().optional(),
  canEdit: z.boolean().optional(),
  canDelete: z.boolean().optional(),
})
type SetPermissionBody = z.infer<typeof setPermissionBodySchema>

const updatePermissionsBodySchema = z.object({
  userId: z.string(),
  permissions: z.record(
    z.string(),
    z.object({
      canAccess: z.boolean().optional(),
      canEdit: z.boolean().optional(),
      canDelete: z.boolean().optional(),
    }),
  ),
})
type UpdatePermissionsBody = z.infer<typeof updatePermissionsBodySchema>

@ApiTags('Usuários')
@ApiBearerAuth()
@Controller('/usuarios')
@UseGuards(PermissionsGuard)
export class UsuarioPermissionsController {
  constructor(
    private checkPermission: CheckUsuarioPermissionUseCase,
    private checkPermissionDebug: CheckUsuarioPermissionDebugUseCase,
    private getPermissions: GetUsuarioPermissionsUseCase,
    private setPermission: SetUsuarioPermissionUseCase,
    private updatePermissions: UpdateUsuarioPermissionsUseCase,
  ) {}

  @Get('checkpermission')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Verificar se o usuário logado tem acesso a uma página',
  })
  @ApiQuery({ name: 'page', required: true })
  async check(@Query('page') page: string, @CurrentUser() user: JwtPayload) {
    if (!page) throw new BadRequestException('Parâmetro "page" é obrigatório')
    const result = await this.checkPermission.execute({
      userId: user.userId,
      role: user.role,
      page,
    })
    return result.value!
  }

  @Get('checkpermission-debug')
  @HttpCode(200)
  @ApiOperation({ summary: 'Debug de permissões do usuário logado' })
  async checkDebug(@CurrentUser() user: JwtPayload) {
    const result = await this.checkPermissionDebug.execute({
      userId: user.userId,
      role: user.role,
    })
    return result.value!
  }

  @Get('all-permissions')
  @HttpCode(200)
  @RequirePermission('usuarios', 'access')
  @ApiOperation({
    summary: 'Todas as permissões de todos os usuários (painel admin)',
  })
  async all() {
    const result = await this.getPermissions.execute({})
    return result.value!
  }

  @Get('permissions')
  @HttpCode(200)
  @RequirePermission('usuarios', 'access')
  @ApiOperation({
    summary: 'Listar permissões (todas ou por userId via ?userId=)',
  })
  async list(@Query('userId') userId?: string) {
    const result = await this.getPermissions.execute({ userId })
    return result.value!
  }

  @Post('permissions')
  @HttpCode(200)
  @RequirePermission('usuarios', 'edit')
  @ApiOperation({
    summary: 'Definir/atualizar permissão de uma página para um usuário',
  })
  async set(
    @Body(new ZodValidationPipe(setPermissionBodySchema))
    body: SetPermissionBody,
  ) {
    const result = await this.setPermission.execute(body)
    return result.value!.permission
  }

  @Post('updatepermissions')
  @HttpCode(200)
  @RequirePermission('usuarios', 'edit')
  @ApiOperation({ summary: 'Atualizar múltiplas permissões de um usuário' })
  async update(
    @Body(new ZodValidationPipe(updatePermissionsBodySchema))
    body: UpdatePermissionsBody,
  ) {
    const result = await this.updatePermissions.execute(body)
    return { message: 'Permissões atualizadas', userId: result.value!.userId }
  }
}
