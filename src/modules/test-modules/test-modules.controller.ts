import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../auth/guards/permissions.guard'
import { PrismaService } from '../../prisma/prisma.service'

@ApiTags('Test Modules')
@ApiBearerAuth()
@Controller('')
@UseGuards(PermissionsGuard)
export class TestModulesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('test-52-ncms')
  @HttpCode(200)
  @RequirePermission('test-modules', 'access')
  @ApiOperation({ summary: 'Testar busca de 52 NCMs' })
  async test52Ncms() {
    const data = await this.prisma.ncm.findMany({
      take: 52,
      orderBy: { id: 'asc' },
    })
    return {
      total: data.length,
      solicitado: 52,
      data,
    }
  }

  @Get('test-batch-50')
  @HttpCode(200)
  @RequirePermission('test-modules', 'access')
  @ApiOperation({ summary: 'Testar batch de 50 itens' })
  async testBatch50() {
    const [ncms, total] = await Promise.all([
      this.prisma.ncm.findMany({ take: 50, orderBy: { id: 'asc' } }),
      this.prisma.ncm.count(),
    ])

    return {
      batchSize: 50,
      retornados: ncms.length,
      totalDisponivel: total,
      data: ncms,
    }
  }

  @Get('test-batch-sizes')
  @HttpCode(200)
  @RequirePermission('test-modules', 'access')
  @ApiOperation({ summary: 'Testar diferentes tamanhos de batch' })
  async testBatchSizes() {
    const total = await this.prisma.ncm.count()
    const sizes = [10, 25, 50, 100]

    const results = await Promise.all(
      sizes.map(async (size) => {
        const start = Date.now()
        const data = await this.prisma.ncm.findMany({
          take: size,
          orderBy: { id: 'asc' },
        })
        const elapsed = Date.now() - start
        return { batchSize: size, retornados: data.length, tempoMs: elapsed }
      }),
    )

    return { totalDisponivel: total, resultados: results }
  }

  @Get('test-sync-horas')
  @HttpCode(200)
  @RequirePermission('test-modules', 'access')
  @ApiOperation({
    summary: 'Testar sincronização de horas — estatísticas do banco de horas',
  })
  async testSyncHoras() {
    const [totalRegistros, totalContas] = await Promise.all([
      this.prisma.registros_banco_horas.count(),
      this.prisma.conta_corrente_horas.count(),
    ])

    const porTipo = await this.prisma.registros_banco_horas.groupBy({
      by: ['tipo'],
      _count: { id: true },
    })

    return {
      registros_banco_horas: { total: totalRegistros },
      conta_corrente_horas: { total: totalContas },
      distribuicaoPorTipo: porTipo.map((t) => ({
        tipo: t.tipo,
        quantidade: t._count.id,
      })),
    }
  }
}
