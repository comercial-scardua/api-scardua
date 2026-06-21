import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from '../../../../auth/decorators/current-user.decorator'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import type { JwtPayload } from '../../../../auth/types/jwt-payload.type'
import { EpiRepository } from '../../../../domain/epi/application/repositories/epi-repository'

@ApiTags('EPI')
@ApiBearerAuth()
@Controller('/epi')
@UseGuards(PermissionsGuard)
export class GetMeController {
  constructor(private repo: EpiRepository) {}

  @Get('me')
  @RequirePermission('epi', 'access')
  @ApiOperation({ summary: 'Perfil do usuário logado no contexto EPI' })
  handle(@CurrentUser() user: JwtPayload) {
    return this.repo.findGestorPerfil(user.userId)
  }
}
