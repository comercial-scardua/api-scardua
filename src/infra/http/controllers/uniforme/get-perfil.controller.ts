import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from '../../../../auth/decorators/current-user.decorator'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import type { JwtPayload } from '../../../../auth/types/jwt-payload.type'
import { GetPerfilUseCase } from '../../../../domain/uniforme/application/use-cases/get-perfil'

@ApiTags('Uniforme')
@ApiBearerAuth()
@Controller('/uniforme/me')
@UseGuards(PermissionsGuard)
export class GetPerfilController {
  constructor(private getPerfil: GetPerfilUseCase) {}

  @Get()
  @HttpCode(200)
  @RequirePermission('uniforme', 'access')
  @ApiOperation({ summary: 'Perfil de uniforme do usuário autenticado' })
  async handle(@CurrentUser() user: JwtPayload) {
    const result = await this.getPerfil.execute(user.userId)
    return result.value
  }
}
