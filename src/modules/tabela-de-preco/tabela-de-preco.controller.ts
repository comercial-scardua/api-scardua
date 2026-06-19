import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from '../../auth/decorators/current-user.decorator'
import { RequirePermission } from '../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../auth/guards/permissions.guard'
import type { JwtPayload } from '../../auth/types/jwt-payload.type'
import { PrismaService } from '../../prisma/prisma.service'
import type {
  IncluirTabelaPrecoDto,
  ImportarTabelaPrecoDto,
  AtualizarTabelaPrecoDto,
  LimparHistoricoDto,
} from './dto/incluir-tabela-preco.dto'

@ApiTags('Tabela de Preço')
@ApiBearerAuth()
@Controller('tabela-de-preco')
@UseGuards(PermissionsGuard)
export class TabelaDePrecoController {
  constructor(private prisma: PrismaService) {}

  @Post('incluir')
  @HttpCode(201)
  @RequirePermission('tabela-de-preco', 'edit')
  @ApiOperation({
    summary:
      'Incluir nova tabela de preço (persiste itens como registros em precificador_historico)',
  })
  async incluir(
    @Body() dto: IncluirTabelaPrecoDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const registros = await Promise.all(
      dto.itens.map((item) =>
        this.prisma.precificador_historico.create({
          data: {
            userId: user.userId,
            empresaId: dto.empresaId,
            empresaNome: dto.empresaNome,
            produtoCodigo: item.produtoCodigo,
            produtoNome: item.produtoNome,
            tipoPrecoBase: 'tabela',
            custoBase: item.precoBase ?? item.precoVenda,
            custosFixosPerc: 0,
            lucroPercDesejado: 0,
            precoFinal: item.precoVenda,
            lucroLiquido: 0,
            margemLiquida: 0,
          },
        }),
      ),
    )

    return { total: registros.length, registros }
  }

  @Post('importar')
  @HttpCode(201)
  @RequirePermission('tabela-de-preco', 'edit')
  @ApiOperation({
    summary: 'Importar tabela de preços (array de produtos+preços)',
  })
  async importar(
    @Body() dto: ImportarTabelaPrecoDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const registros = await Promise.all(
      dto.itens.map((item) =>
        this.prisma.precificador_historico.create({
          data: {
            userId: user.userId,
            empresaId: dto.empresaId,
            empresaNome: dto.empresaNome,
            produtoCodigo: item.produtoCodigo,
            produtoNome: item.produtoNome,
            tipoPrecoBase: 'importacao',
            custoBase: item.precoBase ?? item.precoVenda,
            custosFixosPerc: 0,
            lucroPercDesejado: 0,
            precoFinal: item.precoVenda,
            lucroLiquido: 0,
            margemLiquida: 0,
          },
        }),
      ),
    )

    return { total: registros.length, registros }
  }

  @Post('atualizar')
  @HttpCode(200)
  @RequirePermission('tabela-de-preco', 'edit')
  @ApiOperation({
    summary: 'Atualizar tabela existente (insere novos registros como revisão)',
  })
  async atualizar(
    @Body() dto: AtualizarTabelaPrecoDto,
    @CurrentUser() user: JwtPayload,
  ) {
    if (!dto.itens || dto.itens.length === 0) {
      return { message: 'Nenhum item fornecido para atualização', total: 0 }
    }

    const registros = await Promise.all(
      dto.itens.map((item) =>
        this.prisma.precificador_historico.create({
          data: {
            userId: user.userId,
            empresaId: dto.empresaId ?? 0,
            empresaNome: dto.empresaNome ?? '',
            produtoCodigo: item.produtoCodigo,
            produtoNome: item.produtoNome,
            tipoPrecoBase: 'atualizacao',
            custoBase: item.precoBase ?? item.precoVenda,
            custosFixosPerc: 0,
            lucroPercDesejado: 0,
            precoFinal: item.precoVenda,
            lucroLiquido: 0,
            margemLiquida: 0,
          },
        }),
      ),
    )

    return { total: registros.length, registros }
  }

  @Get('template')
  @HttpCode(200)
  @RequirePermission('tabela-de-preco', 'access')
  @ApiOperation({
    summary: 'Retorna template de importação de tabela de preços',
  })
  template() {
    return {
      descricao: 'Template para importação de tabela de preços',
      formato: 'JSON',
      campos: [
        { campo: 'empresaId', tipo: 'number', obrigatorio: true },
        { campo: 'empresaNome', tipo: 'string', obrigatorio: true },
        {
          campo: 'itens',
          tipo: 'array',
          obrigatorio: true,
          subcampos: [
            { campo: 'produtoCodigo', tipo: 'string', obrigatorio: true },
            { campo: 'produtoNome', tipo: 'string', obrigatorio: true },
            { campo: 'precoVenda', tipo: 'number', obrigatorio: true },
            { campo: 'precoBase', tipo: 'number', obrigatorio: false },
            { campo: 'observacao', tipo: 'string', obrigatorio: false },
          ],
        },
      ],
      exemplo: {
        empresaId: 1,
        empresaNome: 'Empresa Exemplo',
        itens: [
          {
            produtoCodigo: 'PROD-001',
            produtoNome: 'Produto 1',
            precoVenda: 29.99,
            precoBase: 20.0,
          },
          {
            produtoCodigo: 'PROD-002',
            produtoNome: 'Produto 2',
            precoVenda: 49.9,
          },
        ],
      },
    }
  }

  @Get('historico')
  @HttpCode(200)
  @RequirePermission('tabela-de-preco', 'access')
  @ApiOperation({
    summary: 'Listar histórico de importações de tabela de preços',
  })
  @ApiQuery({ name: 'empresaId', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async historico(
    @Query('empresaId') empresaId?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    const pageNum = parseInt(page) || 1
    const limitNum = parseInt(limit) || 20
    const skip = (pageNum - 1) * limitNum

    const where = {
      tipoPrecoBase: {
        in: ['tabela', 'importacao', 'atualizacao'] as string[],
      },
      ...(empresaId ? { empresaId: parseInt(empresaId) } : {}),
    }

    const [total, dados] = await Promise.all([
      this.prisma.precificador_historico.count({ where }),
      this.prisma.precificador_historico.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
    ])

    return {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
      dados,
    }
  }

  @Delete('historico')
  @HttpCode(200)
  @RequirePermission('tabela-de-preco', 'edit')
  @ApiOperation({
    summary: 'Limpar histórico de importações (body: { ids?: number[] })',
  })
  async limparHistorico(@Body() dto: LimparHistoricoDto) {
    if (dto.ids && dto.ids.length > 0) {
      const result = await this.prisma.precificador_historico.deleteMany({
        where: { id: { in: dto.ids } },
      })
      return {
        deletados: result.count,
        mensagem: `${result.count} registro(s) removido(s)`,
      }
    }

    // Deleta apenas os do tipo tabela/importacao/atualizacao
    const result = await this.prisma.precificador_historico.deleteMany({
      where: { tipoPrecoBase: { in: ['tabela', 'importacao', 'atualizacao'] } },
    })
    return {
      deletados: result.count,
      mensagem: `Histórico limpo: ${result.count} registro(s) removido(s)`,
    }
  }
}
