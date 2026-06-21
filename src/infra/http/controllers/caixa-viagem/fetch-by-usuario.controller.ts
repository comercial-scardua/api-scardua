import { Controller, Get, HttpCode, Param, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { FetchCaixasViagemByUserUseCase } from '../../../../domain/caixa-viagem/application/use-cases/fetch-caixas-viagem-by-user'

@ApiTags('Caixa Viagem')
@ApiBearerAuth()
@Controller('/caixaviagem')
@UseGuards(PermissionsGuard)
export class FetchByUsuarioController {
  constructor(
    private fetchCaixasViagemByUser: FetchCaixasViagemByUserUseCase,
  ) {}

  @Get('usuario/:id')
  @HttpCode(200)
  @RequirePermission('caixaviagem', 'access')
  @ApiOperation({ summary: 'Listar caixas de viagem de um usuário' })
  async handle(@Param('id') id: string) {
    const result = await this.fetchCaixasViagemByUser.execute({ userId: id })
    return result.value?.caixas
  }
}
