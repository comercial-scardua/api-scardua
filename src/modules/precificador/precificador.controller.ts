import {
  Body,
  Controller,
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
import type {
  SalvarPrecificacaoDto,
  AtualizarPrecosDto,
} from './dto/salvar-precificacao.dto'
import { PrecificadorRepository } from './repositories/precificador.repository'

@ApiTags('Precificador')
@ApiBearerAuth()
@Controller('precificador')
@UseGuards(PermissionsGuard)
export class PrecificadorController {
  constructor(private repo: PrecificadorRepository) {}

  @Get('buscar-produto')
  @HttpCode(200)
  @RequirePermission('precificador', 'access')
  @ApiOperation({ summary: 'Buscar produto por código ou nome' })
  @ApiQuery({ name: 'q', required: false, type: String })
  @ApiQuery({ name: 'codigo', required: false, type: String })
  buscarProduto(@Query('q') q?: string, @Query('codigo') codigo?: string) {
    return this.repo.buscarProduto(q, codigo)
  }

  @Get('buscar-ncm')
  @HttpCode(200)
  @RequirePermission('precificador', 'access')
  @ApiOperation({ summary: 'Buscar produto por NCM' })
  @ApiQuery({ name: 'ncm', required: false, type: String })
  buscarNcm(@Query('ncm') ncm?: string) {
    return this.repo.buscarNcm(ncm)
  }

  @Get('buscar-fornecedor')
  @HttpCode(200)
  @RequirePermission('precificador', 'access')
  @ApiOperation({
    summary:
      'Buscar por fornecedor (empresaNome no histórico de precificações)',
  })
  @ApiQuery({ name: 'fornecedor', required: false, type: String })
  buscarFornecedor(@Query('fornecedor') fornecedor?: string) {
    return this.repo.buscarFornecedor(fornecedor)
  }

  @Get('buscar-nf')
  @HttpCode(200)
  @RequirePermission('precificador', 'access')
  @ApiOperation({ summary: 'Buscar nota fiscal (stock_entries)' })
  @ApiQuery({ name: 'nf', required: false, type: String })
  @ApiQuery({ name: 'fornecedor', required: false, type: String })
  buscarNf(@Query('nf') nf?: string, @Query('fornecedor') fornecedor?: string) {
    return this.repo.buscarNf(nf, fornecedor)
  }

  @Get('buscar-nf-importacao')
  @HttpCode(200)
  @RequirePermission('precificador', 'access')
  @ApiOperation({ summary: 'Buscar NF de importação (stock_entries)' })
  @ApiQuery({ name: 'nf', required: false, type: String })
  buscarNfImportacao(@Query('nf') nf?: string) {
    return this.repo.buscarNfImportacao(nf)
  }

  @Get('historico')
  @HttpCode(200)
  @RequirePermission('precificador', 'access')
  @ApiOperation({ summary: 'Histórico de precificações' })
  @ApiQuery({ name: 'produtoId', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  historico(
    @Query('produtoId') produtoId?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.repo.historico(
      produtoId ? parseInt(produtoId) : undefined,
      parseInt(page) || 1,
      parseInt(limit) || 20,
    )
  }

  @Post('salvar')
  @HttpCode(201)
  @RequirePermission('precificador', 'edit')
  @ApiOperation({
    summary: 'Salvar precificação (cria registro em precificador_historico)',
  })
  salvar(@Body() dto: SalvarPrecificacaoDto, @CurrentUser() user: JwtPayload) {
    return this.repo.salvar({ ...dto, userId: dto.userId || user.userId })
  }

  @Post('atualizar-precos')
  @HttpCode(200)
  @RequirePermission('precificador', 'edit')
  @ApiOperation({
    summary: 'Atualizar preços de produtos (array de { produtoId, preco })',
  })
  atualizarPrecos(@Body() dto: AtualizarPrecosDto) {
    return this.repo.atualizarPrecos(dto)
  }

  @Post('atualizar-precos-lote')
  @HttpCode(200)
  @RequirePermission('precificador', 'edit')
  @ApiOperation({
    summary:
      'Atualizar preços em lote maior (mesma lógica, sem limite de itens)',
  })
  atualizarPrecosLote(@Body() dto: AtualizarPrecosDto) {
    return this.repo.atualizarPrecos(dto)
  }
}
