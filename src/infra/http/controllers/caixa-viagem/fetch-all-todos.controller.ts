import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { FetchAllCaixasViagemUseCase } from '../../../../domain/caixa-viagem/application/use-cases/fetch-all-caixas-viagem'

@ApiTags('Caixa Viagem')
@ApiBearerAuth()
@Controller('/caixaviagem')
@UseGuards(PermissionsGuard)
export class FetchAllTodosController {
  constructor(private fetchAllCaixasViagem: FetchAllCaixasViagemUseCase) {}

  @Get('todos')
  @HttpCode(200)
  @RequirePermission('caixaviagem', 'access')
  @ApiOperation({ summary: 'Listar todos os caixas de viagem' })
  @ApiQuery({ name: 'showHidden', required: false, type: Boolean })
  async handle(@Query('showHidden') showHidden?: string) {
    const result = await this.fetchAllCaixasViagem.execute(
      showHidden === 'true',
    )
    return result.value?.caixas
  }
}
