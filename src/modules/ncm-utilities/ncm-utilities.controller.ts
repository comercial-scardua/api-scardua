import { Body, Controller, Get, HttpCode, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RequirePermission } from '../../auth/decorators/require-permission.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { PrismaService } from '../../prisma/prisma.service';

@ApiTags('NCM Utilities')
@ApiBearerAuth()
@Controller('')
@UseGuards(PermissionsGuard)
export class NcmUtilitiesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('list-ncms')
  @HttpCode(200)
  @RequirePermission('ncm-utilities', 'access')
  @ApiOperation({ summary: 'Listar todos os NCMs paginado' })
  @ApiQuery({ name: 'page', required: false, description: 'Página (padrão: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Itens por página (padrão: 100)' })
  async listNcms(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = Math.max(1, parseInt(page ?? '1', 10) || 1);
    const limitNum = Math.min(500, Math.max(1, parseInt(limit ?? '100', 10) || 100));
    const skip = (pageNum - 1) * limitNum;

    const [total, data] = await Promise.all([
      this.prisma.ncm.count(),
      this.prisma.ncm.findMany({ skip, take: limitNum, orderBy: { id: 'asc' } }),
    ]);

    return {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      data,
    };
  }

  @Get('search-ncm')
  @HttpCode(200)
  @RequirePermission('ncm-utilities', 'access')
  @ApiOperation({ summary: 'Buscar NCM por código, descrição ou texto livre' })
  @ApiQuery({ name: 'q', required: false, description: 'Texto livre' })
  @ApiQuery({ name: 'codigo', required: false, description: 'Código NCM' })
  @ApiQuery({ name: 'descricao', required: false, description: 'Categoria/descrição' })
  async searchNcm(
    @Query('q') q?: string,
    @Query('codigo') codigo?: string,
    @Query('descricao') descricao?: string,
  ) {
    const where: Record<string, unknown> = {};

    if (codigo) {
      where['codigo_ncm'] = { contains: codigo };
    }

    if (descricao) {
      where['categoria_cliente'] = { contains: descricao };
    }

    if (q && !codigo && !descricao) {
      where['OR'] = [
        { codigo_ncm: { contains: q } },
        { categoria_cliente: { contains: q } },
        { empresa: { contains: q } },
      ];
    }

    const data = await this.prisma.ncm.findMany({
      where,
      take: 200,
      orderBy: { codigo_ncm: 'asc' },
    });

    return { total: data.length, data };
  }

  @Get('diagnose-ncm-limit')
  @HttpCode(200)
  @RequirePermission('ncm-utilities', 'access')
  @ApiOperation({ summary: 'Diagnosticar limite de NCMs — retorna contagem total' })
  async diagnoseNcmLimit() {
    const total = await this.prisma.ncm.count();
    const ativos = await this.prisma.ncm.count({ where: { ativo: true } });
    const inativos = total - ativos;
    return { total, ativos, inativos };
  }

  @Post('compare-ncm-queries')
  @HttpCode(200)
  @RequirePermission('ncm-utilities', 'edit')
  @ApiOperation({ summary: 'Comparar duas queries NCM (diagnóstico interno)' })
  async compareNcmQueries(@Body() body: { query1?: string; query2?: string }) {
    return {
      message: 'Comparação via Oracle não disponível',
      query1: body.query1 ?? null,
      query2: body.query2 ?? null,
    };
  }

  @Get('final-ncm-validation')
  @HttpCode(200)
  @RequirePermission('ncm-utilities', 'access')
  @ApiOperation({ summary: 'Validação final dos NCMs — verifica integridade' })
  async finalNcmValidation() {
    const total = await this.prisma.ncm.count();
    const semCodigoNcm = await this.prisma.ncm.count({
      where: { codigo_ncm: '' },
    });
    const semEmpresa = await this.prisma.ncm.count({
      where: { empresa: '' },
    });
    const semUfEmissor = await this.prisma.ncm.count({
      where: { uf_emissor: '' },
    });
    const semUfDestino = await this.prisma.ncm.count({
      where: { uf_destino: '' },
    });

    return {
      total,
      integridade: {
        semCodigoNcm,
        semEmpresa,
        semUfEmissor,
        semUfDestino,
      },
      valido: semCodigoNcm === 0 && semEmpresa === 0,
    };
  }

  @Get('validar-pecas-ncm')
  @HttpCode(200)
  @RequirePermission('ncm-utilities', 'access')
  @ApiOperation({ summary: 'Validar peças por NCM — produtos sem NCM válido' })
  async validarPecasNcm() {
    const semNcm = await this.prisma.precificador_historico.findMany({
      where: {
        OR: [{ ncmCodigo: null }, { ncmCodigo: '' }],
      },
      select: {
        id: true,
        produtoCodigo: true,
        produtoNome: true,
        ncmCodigo: true,
        ncmCategoria: true,
        createdAt: true,
      },
      take: 100,
      orderBy: { createdAt: 'desc' },
    });

    const total = await this.prisma.precificador_historico.count({
      where: {
        OR: [{ ncmCodigo: null }, { ncmCodigo: '' }],
      },
    });

    return {
      total,
      registros: semNcm,
    };
  }
}
