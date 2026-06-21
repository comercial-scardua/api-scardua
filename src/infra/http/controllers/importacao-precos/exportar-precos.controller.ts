import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { ExportarPrecosUseCase } from '../../../../domain/importacao-precos/application/use-cases/exportar-precos'

@ApiTags('Importacao de Precos')
@ApiBearerAuth()
@Controller('/importacao-precos')
@UseGuards(PermissionsGuard)
export class ExportarPrecosController {
  constructor(private exportarPrecos: ExportarPrecosUseCase) {}

  @Get('exportar')
  @HttpCode(200)
  @RequirePermission('importacao-precos', 'access')
  @ApiOperation({
    summary: 'Exportar precos dos produtos (filtros: categoria, grupo, marca)',
  })
  @ApiQuery({ name: 'categoria', required: false, type: String })
  @ApiQuery({ name: 'grupo', required: false, type: String })
  @ApiQuery({ name: 'marca', required: false, type: String })
  async handle(
    @Query('categoria') categoria?: string,
    @Query('grupo') grupo?: string,
    @Query('marca') marca?: string,
  ) {
    const result = await this.exportarPrecos.execute(categoria, grupo, marca)
    return result.value!
  }
}
