import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { RequirePermission } from '../../auth/decorators/require-permission.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import type { JwtPayload } from '../../auth/types/jwt-payload.type';
import type { CriarEntradaDto } from './dto/criar-entrada.dto';
import type { CriarProdutoDto } from './dto/criar-produto.dto';
import type { CriarSaidaDto } from './dto/criar-saida.dto';
import type { CriarTransferenciaDto } from './dto/criar-transferencia.dto';
import { EstoqueRepository } from './repositories/estoque.repository';
import { AtualizarProdutoUseCase } from './use-cases/atualizar-produto.use-case';
import { CriarEntradaUseCase } from './use-cases/criar-entrada.use-case';
import { CriarProdutoUseCase } from './use-cases/criar-produto.use-case';
import { CriarSaidaUseCase } from './use-cases/criar-saida.use-case';
import { CriarTransferenciaUseCase } from './use-cases/criar-transferencia.use-case';
import { DesativarProdutoUseCase } from './use-cases/desativar-produto.use-case';
import { CodigoJaCadastradoError } from './use-cases/errors/codigo-ja-cadastrado.error';
import { ProdutoNaoEncontradoError } from './use-cases/errors/produto-nao-encontrado.error';
import { SaldoInsuficienteError } from './use-cases/errors/saldo-insuficiente.error';

@ApiTags('Estoque')
@ApiBearerAuth()
@Controller('estoque')
@UseGuards(PermissionsGuard)
export class EstoqueController {
  constructor(
    private repo: EstoqueRepository,
    private criarProduto: CriarProdutoUseCase,
    private atualizarProduto: AtualizarProdutoUseCase,
    private desativarProduto: DesativarProdutoUseCase,
    private criarEntrada: CriarEntradaUseCase,
    private criarSaida: CriarSaidaUseCase,
    private criarTransferencia: CriarTransferenciaUseCase,
  ) {}

  // ── Dashboard e saldos ────────────────────────────────────────────────────

  @Get('dashboard')
  @HttpCode(200)
  @RequirePermission('estoque', 'access')
  @ApiOperation({ summary: 'Métricas do mês corrente' })
  dashboard() {
    return this.repo.dashboard();
  }

  @Get('saldo-filiais')
  @HttpCode(200)
  @RequirePermission('estoque', 'access')
  @ApiOperation({ summary: 'Matriz de saldos produto × empresa (SQL raw)' })
  @ApiQuery({ name: 'produtoId', required: false, type: Number })
  @ApiQuery({ name: 'empresaId', required: false, type: Number })
  async saldoFiliais(
    @Query('produtoId') produtoId?: number,
    @Query('empresaId') empresaId?: number,
  ) {
    const [produtos, empresas, saldos] = await Promise.all([
      this.repo.findProdutos({ status: 'ATIVO', ...(produtoId && { search: String(produtoId) }) }),
      this.repo.findEmpresas(),
      this.repo.saldoFiliais(produtoId, empresaId),
    ]);
    return { produtos: produtos.data, empresas, saldos };
  }

  @Get('empresas')
  @HttpCode(200)
  @RequirePermission('estoque', 'access')
  @ApiOperation({ summary: 'Listar empresas disponíveis para movimentações de estoque' })
  findEmpresas() {
    return this.repo.findEmpresas();
  }

  // ── Produtos ──────────────────────────────────────────────────────────────

  @Get('produtos')
  @HttpCode(200)
  @RequirePermission('estoque', 'access')
  @ApiOperation({ summary: 'Listar produtos com paginação e filtros' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'categoria', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findProdutos(
    @Query('search') search?: string,
    @Query('categoria') categoria?: string,
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.repo.findProdutos({ search, categoria, status, page, limit });
  }

  @Get('produtos/:id')
  @HttpCode(200)
  @RequirePermission('estoque', 'access')
  @ApiOperation({ summary: 'Buscar produto por ID' })
  async findProduto(@Param('id', ParseIntPipe) id: number) {
    const produto = await this.repo.findProdutoById(id);
    if (!produto) throw new NotFoundException(`Produto #${id} não encontrado`);
    return produto;
  }

  @Post('produtos')
  @HttpCode(201)
  @RequirePermission('estoque', 'edit')
  @ApiOperation({ summary: 'Criar produto (código interno único)' })
  async createProduto(@Body() dto: CriarProdutoDto, @CurrentUser() user: JwtPayload) {
    const result = await this.criarProduto.execute(dto, user.userId);

    if (result.isLeft()) {
      throw new ConflictException(result.value.message);
    }

    return result.value.produto;
  }

  @Put('produtos/:id')
  @HttpCode(200)
  @RequirePermission('estoque', 'edit')
  @ApiOperation({ summary: 'Atualizar produto' })
  async updateProduto(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CriarProdutoDto>,
  ) {
    const result = await this.atualizarProduto.execute(id, dto);

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message);
    }

    return result.value.produto;
  }

  @Delete('produtos/:id')
  @HttpCode(204)
  @RequirePermission('estoque', 'edit')
  @ApiOperation({ summary: 'Desativar produto (status = INATIVO)' })
  async deleteProduto(@Param('id', ParseIntPipe) id: number) {
    const result = await this.desativarProduto.execute(id);

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message);
    }
  }

  // ── Entradas ──────────────────────────────────────────────────────────────

  @Get('entradas')
  @HttpCode(200)
  @RequirePermission('estoque', 'access')
  @ApiOperation({ summary: 'Listar entradas com filtros' })
  @ApiQuery({ name: 'produtoId', required: false, type: Number })
  @ApiQuery({ name: 'numeroNotaFiscal', required: false })
  @ApiQuery({ name: 'dataInicio', required: false })
  @ApiQuery({ name: 'dataFim', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findEntradas(
    @Query('produtoId') produtoId?: number,
    @Query('numeroNotaFiscal') numeroNotaFiscal?: string,
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.repo.findEntradas({ produtoId, numeroNotaFiscal, dataInicio, dataFim, page, limit });
  }

  @Get('entradas/:id')
  @HttpCode(200)
  @RequirePermission('estoque', 'access')
  @ApiOperation({ summary: 'Buscar entrada por ID' })
  async findEntrada(@Param('id', ParseIntPipe) id: number) {
    const entrada = await this.repo.findEntradaById(id);
    if (!entrada) throw new NotFoundException(`Entrada #${id} não encontrada`);
    return entrada;
  }

  @Post('entradas')
  @HttpCode(201)
  @RequirePermission('estoque', 'edit')
  @UseInterceptors(FileInterceptor('arquivo', { limits: { fileSize: 10 * 1024 * 1024 } }))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Registrar entrada de estoque (transação atômica, upload NF opcional)' })
  async createEntrada(
    @Body() dto: CriarEntradaDto,
    @CurrentUser() user: JwtPayload,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const result = await this.criarEntrada.execute(dto, user.userId, file);

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message);
    }

    return result.value.entrada;
  }

  @Delete('entradas/:id')
  @HttpCode(204)
  @RequirePermission('estoque', 'edit')
  @ApiOperation({ summary: 'Excluir entrada (reverte estoqueAtual)' })
  async deleteEntrada(@Param('id', ParseIntPipe) id: number) {
    const existe = await this.repo.findEntradaById(id);
    if (!existe) throw new NotFoundException(`Entrada #${id} não encontrada`);
    await this.repo.excluirEntrada(id);
  }

  // ── Saídas ────────────────────────────────────────────────────────────────

  @Get('saidas')
  @HttpCode(200)
  @RequirePermission('estoque', 'access')
  @ApiOperation({ summary: 'Listar saídas com filtros' })
  @ApiQuery({ name: 'produtoId', required: false, type: Number })
  @ApiQuery({ name: 'responsavel', required: false })
  @ApiQuery({ name: 'motivo', required: false })
  @ApiQuery({ name: 'dataInicio', required: false })
  @ApiQuery({ name: 'dataFim', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findSaidas(
    @Query('produtoId') produtoId?: number,
    @Query('responsavel') responsavel?: string,
    @Query('motivo') motivo?: string,
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.repo.findSaidas({ produtoId, responsavel, motivo, dataInicio, dataFim, page, limit });
  }

  @Get('saidas/:id')
  @HttpCode(200)
  @RequirePermission('estoque', 'access')
  @ApiOperation({ summary: 'Buscar saída por ID' })
  async findSaida(@Param('id', ParseIntPipe) id: number) {
    const saida = await this.repo.findSaidaById(id);
    if (!saida) throw new NotFoundException(`Saída #${id} não encontrada`);
    return saida;
  }

  @Post('saidas')
  @HttpCode(201)
  @RequirePermission('estoque', 'edit')
  @ApiOperation({ summary: 'Registrar saída (valida saldo + transação atômica)' })
  async createSaida(@Body() dto: CriarSaidaDto, @CurrentUser() user: JwtPayload) {
    const result = await this.criarSaida.execute(dto, user.userId);

    if (result.isLeft()) {
      switch (result.value.constructor) {
        case SaldoInsuficienteError:
          throw new BadRequestException(result.value.message);
        default:
          throw new NotFoundException(result.value.message);
      }
    }

    return result.value.saida;
  }

  @Delete('saidas/:id')
  @HttpCode(204)
  @RequirePermission('estoque', 'edit')
  @ApiOperation({ summary: 'Excluir saída (reverte estoqueAtual)' })
  async deleteSaida(@Param('id', ParseIntPipe) id: number) {
    const existe = await this.repo.findSaidaById(id);
    if (!existe) throw new NotFoundException(`Saída #${id} não encontrada`);
    await this.repo.excluirSaida(id);
  }

  // ── Transferências ────────────────────────────────────────────────────────

  @Get('transferencias')
  @HttpCode(200)
  @RequirePermission('estoque', 'access')
  @ApiOperation({ summary: 'Listar transferências com filtros' })
  @ApiQuery({ name: 'produtoId', required: false, type: Number })
  @ApiQuery({ name: 'empresaOrigemId', required: false, type: Number })
  @ApiQuery({ name: 'empresaDestinoId', required: false, type: Number })
  @ApiQuery({ name: 'dataInicio', required: false })
  @ApiQuery({ name: 'dataFim', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findTransferencias(
    @Query('produtoId') produtoId?: number,
    @Query('empresaOrigemId') empresaOrigemId?: number,
    @Query('empresaDestinoId') empresaDestinoId?: number,
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.repo.findTransferencias({ produtoId, empresaOrigemId, empresaDestinoId, dataInicio, dataFim, page, limit });
  }

  @Get('transferencias/:id')
  @HttpCode(200)
  @RequirePermission('estoque', 'access')
  @ApiOperation({ summary: 'Buscar transferência por ID' })
  async findTransferencia(@Param('id', ParseIntPipe) id: number) {
    const transferencia = await this.repo.findTransferenciaById(id);
    if (!transferencia) throw new NotFoundException(`Transferência #${id} não encontrada`);
    return transferencia;
  }

  @Post('transferencias')
  @HttpCode(201)
  @RequirePermission('estoque', 'edit')
  @ApiOperation({ summary: 'Transferir estoque entre filiais (valida saldo na origem)' })
  async createTransferencia(@Body() dto: CriarTransferenciaDto, @CurrentUser() user: JwtPayload) {
    const result = await this.criarTransferencia.execute(dto, user.userId);

    if (result.isLeft()) {
      switch (result.value.constructor) {
        case SaldoInsuficienteError:
          throw new BadRequestException(result.value.message);
        default:
          throw new NotFoundException(result.value.message);
      }
    }

    return result.value.transferencia;
  }
}
