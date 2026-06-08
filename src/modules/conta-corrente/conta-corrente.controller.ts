import {
  Body,
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
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { RequirePermission } from '../../auth/decorators/require-permission.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import type { JwtPayload } from '../../auth/types/jwt-payload.type';
import type { CriarContaCorrenteDto } from './dto/criar-conta-corrente.dto';
import type { CriarLancamentoDto } from './dto/criar-lancamento.dto';
import { ContaCorrenteRepository } from './repositories/conta-corrente.repository';
import { ContaNaoEncontradaError } from './use-cases/errors/conta-nao-encontrada.error';
import { ExcluirContaUseCase } from './use-cases/excluir-conta.use-case';

@ApiTags('Conta Corrente')
@ApiBearerAuth()
@Controller('conta-corrente')
@UseGuards(PermissionsGuard)
export class ContaCorrenteController {
  constructor(
    private repo: ContaCorrenteRepository,
    private excluirUseCase: ExcluirContaUseCase,
  ) {}

  @Get('stats')
  @HttpCode(200)
  @ApiOperation({ summary: 'Estatísticas de contas corrente (próprias; ?all=true para global)' })
  @ApiQuery({ name: 'all', required: false, type: Boolean })
  stats(@CurrentUser() user: JwtPayload, @Query('all') all?: string) {
    return this.repo.stats(user.userId, all === 'true');
  }

  @Get()
  @HttpCode(200)
  @RequirePermission('contacorrente', 'access')
  @ApiOperation({ summary: 'Listar contas do usuário logado' })
  findMinhas(@CurrentUser() user: JwtPayload) {
    return this.repo.findByUserId(user.userId);
  }

  @Get('todos')
  @HttpCode(200)
  @RequirePermission('contacorrentetodos', 'access')
  @ApiOperation({ summary: 'Listar todas as contas (admin/permissão especial)' })
  @ApiQuery({ name: 'showHidden', required: false, type: Boolean })
  findTodas(@Query('showHidden') showHidden?: boolean) {
    return this.repo.findAll(showHidden);
  }

  @Get('resumo/:userId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Resumo financeiro de um usuário' })
  resumo(@Param('userId') userId: string) {
    return this.repo.resumo(userId);
  }

  @Get(':id')
  @HttpCode(200)
  @RequirePermission('contacorrente', 'access')
  @ApiOperation({ summary: 'Buscar conta corrente por ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const conta = await this.repo.findById(id);
    if (!conta) throw new NotFoundException(`Conta corrente #${id} não encontrada`);
    return conta;
  }

  @Post()
  @HttpCode(201)
  @RequirePermission('contacorrente', 'access')
  @ApiOperation({ summary: 'Criar conta corrente' })
  create(@Body() dto: CriarContaCorrenteDto, @CurrentUser() user: JwtPayload) {
    return this.repo.create(dto, user.userId);
  }

  @Patch(':id')
  @HttpCode(200)
  @RequirePermission('contacorrente', 'access')
  @ApiOperation({ summary: 'Atualizar conta corrente' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CriarContaCorrenteDto>,
  ) {
    const existe = await this.repo.findById(id);
    if (!existe) throw new NotFoundException(`Conta corrente #${id} não encontrada`);
    return this.repo.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @RequirePermission('contacorrente', 'access')
  @ApiOperation({ summary: 'Excluir conta e seus lançamentos (cascade)' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const result = await this.excluirUseCase.execute(id);
    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case ContaNaoEncontradaError:
          throw new NotFoundException(error.message);
        default:
          throw new NotFoundException(error.message);
      }
    }
  }

  @Put(':id')
  @HttpCode(200)
  @RequirePermission('contacorrente', 'access')
  @ApiOperation({ summary: 'Alternar visibilidade da conta (oculto/visível)' })
  async toggleOculto(@Param('id', ParseIntPipe) id: number) {
    const existe = await this.repo.findById(id);
    if (!existe) throw new NotFoundException(`Conta corrente #${id} não encontrada`);
    return this.repo.toggleOculto(id);
  }

  // ── Lançamentos ──────────────────────────────────────────────────────────

  @Post(':id/lancamentos')
  @HttpCode(201)
  @RequirePermission('contacorrente', 'access')
  @ApiOperation({ summary: 'Adicionar lançamento à conta' })
  async criarLancamento(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CriarLancamentoDto,
  ) {
    const existe = await this.repo.findById(id);
    if (!existe) throw new NotFoundException(`Conta corrente #${id} não encontrada`);
    return this.repo.criarLancamento(id, dto);
  }

  @Patch(':id/lancamentos/:lancamentoId')
  @HttpCode(200)
  @RequirePermission('contacorrente', 'access')
  @ApiOperation({ summary: 'Atualizar lançamento' })
  atualizarLancamento(
    @Param('lancamentoId', ParseIntPipe) lancamentoId: number,
    @Body() dto: Partial<CriarLancamentoDto>,
  ) {
    return this.repo.atualizarLancamento(lancamentoId, dto);
  }

  @Delete(':id/lancamentos/:lancamentoId')
  @HttpCode(204)
  @RequirePermission('contacorrente', 'access')
  @ApiOperation({ summary: 'Excluir lançamento' })
  async excluirLancamento(
    @Param('lancamentoId', ParseIntPipe) lancamentoId: number,
  ) {
    await this.repo.excluirLancamento(lancamentoId);
  }
}
