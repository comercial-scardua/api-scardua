import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { FetchVeiculosUseCase } from '../../../../domain/patrimonios/application/use-cases/fetch-veiculos'

@ApiTags('Patrimônios')
@ApiBearerAuth()
@Controller('/patrimonio')
@UseGuards(PermissionsGuard)
export class FetchVeiculosController {
  constructor(private fetchVeiculos: FetchVeiculosUseCase) {}

  @Get('veiculos')
  @HttpCode(200)
  @ApiOperation({ summary: 'Listar veículos (para seletores)' })
  async handle() {
    const result = await this.fetchVeiculos.execute()
    return { veiculos: result.value!.veiculos }
  }
}
