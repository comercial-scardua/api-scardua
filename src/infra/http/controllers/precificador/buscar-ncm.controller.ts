import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { BuscarNcmPrecificadorUseCase } from '../../../../domain/precificador/application/use-cases/buscar-ncm'

@ApiTags('Precificador')
@ApiBearerAuth()
@Controller('/precificador')
@UseGuards(PermissionsGuard)
export class BuscarNcmController {
  constructor(private buscarNcm: BuscarNcmPrecificadorUseCase) {}

  @Get('buscar-ncm')
  @HttpCode(200)
  @RequirePermission('precificador', 'access')
  @ApiOperation({ summary: 'Buscar produto por NCM' })
  @ApiQuery({ name: 'ncm', required: false, type: String })
  async handle(@Query('ncm') ncm?: string) {
    const result = await this.buscarNcm.execute(ncm)
    return result.value
  }
}
