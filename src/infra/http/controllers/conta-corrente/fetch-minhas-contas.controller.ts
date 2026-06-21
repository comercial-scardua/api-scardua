import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from '../../../../auth/decorators/current-user.decorator'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import type { JwtPayload } from '../../../../auth/types/jwt-payload.type'
import { FetchContasByUserUseCase } from '../../../../domain/conta-corrente/application/use-cases/fetch-contas-by-user'

@ApiTags('Conta Corrente')
@ApiBearerAuth()
@Controller('/conta-corrente')
@UseGuards(PermissionsGuard)
export class FetchMinhasContasController {
  constructor(private fetchContasByUser: FetchContasByUserUseCase) {}

  @Get()
  @HttpCode(200)
  @RequirePermission('contacorrente', 'access')
  @ApiOperation({ summary: 'Listar contas do usuário logado' })
  async handle(@CurrentUser() user: JwtPayload) {
    const result = await this.fetchContasByUser.execute({
      userId: user.userId,
    })
    return result.value.contas
  }
}
