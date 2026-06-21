import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from '../../../../auth/decorators/current-user.decorator'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import type { JwtPayload } from '../../../../auth/types/jwt-payload.type'
import { ObterHorasUsuarioUseCase } from '../../../../domain/banco-horas/application/use-cases/obter-horas-usuario.use-case'

@ApiTags('Banco de Horas')
@ApiBearerAuth()
@Controller('/banco-de-horas')
@UseGuards(PermissionsGuard)
export class ObterHorasUsuarioController {
  constructor(private obterHorasUsuarioUseCase: ObterHorasUsuarioUseCase) {}

  @Get('usuario/horas')
  @HttpCode(200)
  @RequirePermission('banco-horas', 'access')
  @ApiOperation({ summary: 'Obter horas do usuário logado' })
  async handle(@CurrentUser() user: JwtPayload) {
    return this.obterHorasUsuarioUseCase.execute(user.userId)
  }
}
