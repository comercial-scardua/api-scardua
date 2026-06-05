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
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { RequirePermission } from '../../auth/decorators/require-permission.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import type { JwtPayload } from '../../auth/types/jwt-payload.type';
import type { SupabaseService } from '../../common/supabase/supabase.service';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import type { CriarEntradaDto } from './dto/criar-entrada.dto';
import type { CriarProdutoDto } from './dto/criar-produto.dto';
import type { CriarSaidaDto } from './dto/criar-saida.dto';
import type { CriarTransferenciaDto } from './dto/criar-transferencia.dto';
import type { EstoqueRepository } from './repositories/estoque.repository';
import type { CriarProdutoUseCase } from './use-cases/criar-produto.use-case';
import type { CriarSaidaUseCase } from './use-cases/criar-saida.use-case';
import type { CriarTransferenciaUseCase } from './use-cases/criar-transferencia.use-case';
import { CodigoJaCadastradoError } from './use-cases/errors/codigo-ja-cadastrado.error';
import { SaldoInsuficienteError } from './use-cases/errors/saldo-insuficiente.error';

@ApiTags('Estoque')
@ApiBearerAuth()
@Controller('estoque')
@UseGuards(PermissionsGuard)
export class EstoqueController {
  constructor(
    private repo: EstoqueRepository,
    private criarProduto: CriarProdutoUseCase,
    private criarSaida: CriarSaidaUseCase,
    private criarTransferencia: CriarTransferenciaUseCase,
    private supabase: SupabaseService,
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
  async saldoFiliais(
    @Query('produtoId') produtoId?: number,
    @Query('empresaId') empresaId?: number,
  ) {
    const [produtos, empresas, saldos] = await Promise.all([
      this.repo.findProdutos({ status: 'ATIVO', ...(produtoId && { search: String(produtoId) }) }),
      Promise.resolve([]),
      this.repo.saldoFiliais(produtoId, empresaId),
    ]);
    return { produtos: produtos.data, empresas, saldos };
  }

  // ── Produtos ──────────────────────────────────────────────────────────────

  @Get('produtos')
  @HttpCode(200)
  @RequirePermission('estoque', 'access')
  @ApiOperation({ summary: 'Listar produtos com paginação e filtros' })
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
      const error = result.value;
      switch (error.constructor) {
        case CodigoJaCadastradoError:
          throw new ConflictException(error.message);
        default:
          throw new ConflictException(error.message);
      }
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
    const existe = await this.repo.findProdutoById(id);
    if (!existe) throw new NotFoundException(`Produto #${id} não encontrado`);
    return this.repo.atualizarProduto(id, dto);
  }

  @Delete('produtos/:id')
  @HttpCode(204)
  @RequirePermission('estoque', 'edit')
  @ApiOperation({ summary: 'Desativar produto (status = INATIVO)' })
  async deleteProduto(@Param('id', ParseIntPipe) id: number) {
    const existe = await this.repo.findProdutoById(id);
    if (!existe) throw new NotFoundException(`Produto #${id} não encontrado`);
    await this.repo.desativarProduto(id);
  }

  // ── Entradas ──────────────────────────────────────────────────────────────

  @Get('entradas')
  @HttpCode(200)
  @RequirePermission('estoque', 'access')
  @ApiOperation({ summary: 'Listar entradas com filtros' })
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
    const produto = await this.repo.findProdutoById(dto.produtoId);
    if (!produto) throw new NotFoundException(`Produto #${dto.produtoId} não encontrado`);

    let arquivoUrl: string | undefined;
    if (file) {
      const ext = extname(file.originalname);
      const path = `notas-fiscais/entrada_${Date.now()}_${randomUUID().slice(0, 8)}${ext}`;
      arquivoUrl = await this.supabase.upload('uploads', path, file.buffer, file.mimetype);
    }

    return this.repo.criarEntrada(dto, user.userId, arquivoUrl);
  }

  // ── Saídas ────────────────────────────────────────────────────────────────

  @Get('saidas')
  @HttpCode(200)
  @RequirePermission('estoque', 'access')
  @ApiOperation({ summary: 'Listar saídas com filtros' })
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

  @Post('saidas')
  @HttpCode(201)
  @RequirePermission('estoque', 'edit')
  @ApiOperation({ summary: 'Registrar saída (valida saldo + transação atômica)' })
  async createSaida(@Body() dto: CriarSaidaDto, @CurrentUser() user: JwtPayload) {
    const result = await this.criarSaida.execute(dto, user.userId);

    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case SaldoInsuficienteError:
          throw new BadRequestException(error.message);
        default:
          throw new NotFoundException(error.message);
      }
    }

    return result.value.saida;
  }

  // ── Transferências ────────────────────────────────────────────────────────

  @Get('transferencias')
  @HttpCode(200)
  @RequirePermission('estoque', 'access')
  @ApiOperation({ summary: 'Listar transferências com filtros' })
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

  @Post('transferencias')
  @HttpCode(201)
  @RequirePermission('estoque', 'edit')
  @ApiOperation({ summary: 'Transferir estoque entre filiais (valida saldo na origem)' })
  async createTransferencia(@Body() dto: CriarTransferenciaDto, @CurrentUser() user: JwtPayload) {
    const result = await this.criarTransferencia.execute(dto, user.userId);

    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case SaldoInsuficienteError:
          throw new BadRequestException(error.message);
        default:
          throw new NotFoundException(error.message);
      }
    }

    return result.value.transferencia;
  }
}
