import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from '../../../../auth/decorators/current-user.decorator'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import type { JwtPayload } from '../../../../auth/types/jwt-payload.type'
import { FetchCaixasViagemByUserUseCase } from '../../../../domain/caixa-viagem/application/use-cases/fetch-caixas-viagem-by-user'

@ApiTags('Caixa Viagem')
@ApiBearerAuth()
@Controller('/caixaviagem')
@UseGuards(PermissionsGuard)
export class FetchMinhasCaixasController {
  constructor(
    private fetchCaixasViagemByUser: FetchCaixasViagemByUserUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  @RequirePermission('caixaviagem', 'access')
  @ApiOperation({ summary: 'Listar caixas de viagem do usuário logado' })
  async handle(@CurrentUser() user: JwtPayload) {
    const result = await this.fetchCaixasViagemByUser.execute({
      userId: user.userId,
    })
    return result.value?.caixas
  }
}
