import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { ListarNcmUseCase } from '../../../../domain/ncm/application/use-cases/listar-ncm'

@ApiTags('NCM')
@ApiBearerAuth()
@Controller('/ncm')
@UseGuards(PermissionsGuard)
export class ListarNcmController {
  constructor(private listarNcm: ListarNcmUseCase) {}

  @Get()
  @HttpCode(200)
  @RequirePermission('ncm', 'access')
  @ApiOperation({ summary: 'Listar NCMs ativos com filtros' })
  @ApiQuery({ name: 'termo', required: false })
  @ApiQuery({ name: 'categoria', required: false })
  @ApiQuery({ name: 'empresa', required: false })
  @ApiQuery({ name: 'uf_emissor', required: false })
  @ApiQuery({ name: 'uf_destino', required: false })
  async handle(
    @Query('termo') termo?: string,
    @Query('categoria') categoria?: string,
    @Query('empresa') empresa?: string,
    @Query('uf_emissor') uf_emissor?: string,
    @Query('uf_destino') uf_destino?: string,
  ) {
    return this.listarNcm.execute({
      termo,
      categoria,
      empresa,
      uf_emissor,
      uf_destino,
    })
  }
}
