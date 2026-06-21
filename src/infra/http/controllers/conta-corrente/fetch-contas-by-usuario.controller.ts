import { Controller, Get, HttpCode, Param, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { FetchContasByUserUseCase } from '../../../../domain/conta-corrente/application/use-cases/fetch-contas-by-user'

@ApiTags('Conta Corrente')
@ApiBearerAuth()
@Controller('/conta-corrente')
@UseGuards(PermissionsGuard)
export class FetchContasByUsuarioController {
  constructor(private fetchContasByUser: FetchContasByUserUseCase) {}

  @Get('usuario/:userId')
  @HttpCode(200)
  @RequirePermission('contacorrente', 'access')
  @ApiOperation({ summary: 'Contas correntes de um usuário específico' })
  async handle(@Param('userId') userId: string) {
    const result = await this.fetchContasByUser.execute({ userId })
    return result.value.contas
  }
}
