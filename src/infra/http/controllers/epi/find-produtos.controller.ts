import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { EpiRepository } from '../../../../domain/epi/application/repositories/epi-repository'

@ApiTags('EPI')
@ApiBearerAuth()
@Controller('/epi')
@UseGuards(PermissionsGuard)
export class FindProdutosController {
  constructor(private repo: EpiRepository) {}

  @Get('produtos')
  @RequirePermission('epi', 'access')
  @ApiOperation({
    summary: 'EPIs em formato compatível com seletor de produtos',
  })
  @ApiQuery({ name: 'status', required: false })
  handle(@Query('status') status?: string) {
    return this.repo.findAllEpis({ status }).then((epis) =>
      epis.map((e) => ({
        id: e.id,
        codigoInterno: e.codigo,
        nome: e.nome,
        categoria: e.categoria,
        unidade: 'un',
        estoqueMinimo: e.estoque_minimo,
        estoqueAtual: e.estoque_atual,
      })),
    )
  }
}
