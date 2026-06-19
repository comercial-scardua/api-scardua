import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { FetchContratosUseCase } from '../../../../domain/contratos/application/use-cases/fetch-contratos'

@ApiTags('Contratos')
@ApiBearerAuth()
@Controller('/contratos')
@UseGuards(PermissionsGuard)
export class FetchContratosController {
  constructor(private fetchContratos: FetchContratosUseCase) {}

  @Get()
  @HttpCode(200)
  @RequirePermission('contratos', 'access')
  @ApiOperation({ summary: 'Listar contratos ativos e finalizados' })
  async handle() {
    const result = await this.fetchContratos.execute()
    return { contratos: result.value!.contratos }
  }
}
