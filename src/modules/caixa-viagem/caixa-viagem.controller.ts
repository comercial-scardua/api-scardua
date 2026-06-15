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
import type { CriarCaixaViagemDto } from './dto/criar-caixa-viagem.dto';
import type { AtualizarCaixaViagemDto } from './dto/atualizar-caixa-viagem.dto';
import type { CriarAdiantamentoDto } from './dto/criar-adiantamento.dto';
import type { CriarViagemLancamentoDto } from './dto/criar-viagem-lancamento.dto';
import { CaixaViagemRepository } from './repositories/caixa-viagem.repository';

@ApiTags('Caixa Viagem')
@ApiBearerAuth()
@Controller('caixaviagem')
@UseGuards(PermissionsGuard)
export class CaixaViagemController {
  constructor(private repo: CaixaViagemRepository) {}

  // ── Stats ────────────────────────────────────────────────────────────────────

  @Get('stats')
  @HttpCode(200)
  @RequirePermission('caixaviagem', 'access')
  @ApiOperation({ summary: 'Estatísticas gerais dos caixas de viagem' })
  stats() {
    return this.repo.stats();
  }

  // ── Todos ────────────────────────────────────────────────────────────────────

  @Get('todos')
  @HttpCode(200)
  @RequirePermission('caixaviagem', 'access')
  @ApiOperation({ summary: 'Listar todos os caixas de viagem' })
  @ApiQuery({ name: 'showHidden', required: false, type: Boolean })
  findTodos(@Query('showHidden') showHidden?: string) {
    return this.repo.findAll(showHidden === 'true');
  }

  @Post('todos')
  @HttpCode(201)
  @RequirePermission('caixaviagem', 'edit')
  @ApiOperation({ summary: 'Criar caixa de viagem (alias /todos)' })
  createTodos(@Body() dto: CriarCaixaViagemDto, @CurrentUser() user: JwtPayload) {
    return this.repo.create(dto, user.userId);
  }

  @Put('todos/:id')
  @HttpCode(200)
  @RequirePermission('caixaviagem', 'edit')
  @ApiOperation({ summary: 'Atualizar caixa de viagem (alias /todos)' })
  async updateTodos(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AtualizarCaixaViagemDto,
  ) {
    const existe = await this.repo.findById(id);
    if (!existe) throw new NotFoundException(`Caixa de viagem #${id} não encontrado`);
    return this.repo.update(id, dto);
  }

  @Patch('todos/:id')
  @HttpCode(200)
  @RequirePermission('caixaviagem', 'edit')
  @ApiOperation({ summary: 'Atualização parcial do caixa de viagem (alias /todos)' })
  async patchTodos(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<AtualizarCaixaViagemDto>,
  ) {
    const existe = await this.repo.findById(id);
    if (!existe) throw new NotFoundException(`Caixa de viagem #${id} não encontrado`);
    return this.repo.update(id, dto);
  }

  // ── Último Caixa por Funcionário ─────────────────────────────────────────────

  @Get('ultimo-caixa/:funcionarioId')
  @HttpCode(200)
  @RequirePermission('caixaviagem', 'access')
  @ApiOperation({ summary: 'Buscar último caixa de um funcionário' })
  async findUltimoCaixa(@Param('funcionarioId', ParseIntPipe) funcionarioId: number) {
    const caixa = await this.repo.findUltimoCaixaFuncionario(funcionarioId);
    if (!caixa) throw new NotFoundException(`Nenhum caixa encontrado para o funcionário #${funcionarioId}`);
    return caixa;
  }

  @Post('ultimo-caixa/:funcionarioId')
  @HttpCode(201)
  @RequirePermission('caixaviagem', 'edit')
  @ApiOperation({ summary: 'Criar caixa para funcionário' })
  createParaFuncionario(
    @Param('funcionarioId', ParseIntPipe) funcionarioId: number,
    @Body() dto: CriarCaixaViagemDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.repo.create({ ...dto, funcionarioId }, user.userId);
  }

  @Put('ultimo-caixa/:funcionarioId')
  @HttpCode(200)
  @RequirePermission('caixaviagem', 'edit')
  @ApiOperation({ summary: 'Atualizar último caixa do funcionário' })
  async updateUltimoCaixa(
    @Param('funcionarioId', ParseIntPipe) funcionarioId: number,
    @Body() dto: AtualizarCaixaViagemDto,
  ) {
    const caixa = await this.repo.findUltimoCaixaFuncionario(funcionarioId);
    if (!caixa) throw new NotFoundException(`Nenhum caixa encontrado para o funcionário #${funcionarioId}`);
    return this.repo.update(caixa.id, dto);
  }

  @Patch('ultimo-caixa/:funcionarioId')
  @HttpCode(200)
  @RequirePermission('caixaviagem', 'edit')
  @ApiOperation({ summary: 'Atualização parcial do último caixa do funcionário' })
  async patchUltimoCaixa(
    @Param('funcionarioId', ParseIntPipe) funcionarioId: number,
    @Body() dto: Partial<AtualizarCaixaViagemDto>,
  ) {
    const caixa = await this.repo.findUltimoCaixaFuncionario(funcionarioId);
    if (!caixa) throw new NotFoundException(`Nenhum caixa encontrado para o funcionário #${funcionarioId}`);
    return this.repo.update(caixa.id, dto);
  }

  // ── Por Usuário ──────────────────────────────────────────────────────────────

  @Get('usuario/:id')
  @HttpCode(200)
  @RequirePermission('caixaviagem', 'access')
  @ApiOperation({ summary: 'Listar caixas de viagem de um usuário' })
  findByUsuario(@Param('id') id: string) {
    return this.repo.findByUserId(id);
  }

  @Post('usuario/:id')
  @HttpCode(201)
  @RequirePermission('caixaviagem', 'edit')
  @ApiOperation({ summary: 'Criar caixa de viagem para usuário específico' })
  createParaUsuario(@Param('id') id: string, @Body() dto: CriarCaixaViagemDto) {
    return this.repo.create({ ...dto, userId: id }, id);
  }

  @Put('usuario/:id')
  @HttpCode(200)
  @RequirePermission('caixaviagem', 'edit')
  @ApiOperation({ summary: 'Atualizar caixa de viagem por ID (rota usuario)' })
  async updateParaUsuario(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AtualizarCaixaViagemDto,
  ) {
    const existe = await this.repo.findById(id);
    if (!existe) throw new NotFoundException(`Caixa de viagem #${id} não encontrado`);
    return this.repo.update(id, dto);
  }

  @Patch('usuario/:id')
  @HttpCode(200)
  @RequirePermission('caixaviagem', 'edit')
  @ApiOperation({ summary: 'Atualização parcial de caixa de viagem (rota usuario)' })
  async patchParaUsuario(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<AtualizarCaixaViagemDto>,
  ) {
    const existe = await this.repo.findById(id);
    if (!existe) throw new NotFoundException(`Caixa de viagem #${id} não encontrado`);
    return this.repo.update(id, dto);
  }

  // ── Resumo ───────────────────────────────────────────────────────────────────

  @Post('resumo/:id')
  @HttpCode(200)
  @RequirePermission('caixaviagem', 'access')
  @ApiOperation({ summary: 'Resumo financeiro de um caixa de viagem' })
  async resumo(@Param('id', ParseIntPipe) id: number) {
    const result = await this.repo.resumo(id);
    if (!result) throw new NotFoundException(`Caixa de viagem #${id} não encontrado`);
    return result;
  }

  // ── Gerar Termo ──────────────────────────────────────────────────────────────

  @Post('generate-termo')
  @HttpCode(200)
  @RequirePermission('caixaviagem', 'access')
  @ApiOperation({ summary: 'Gerar JSON com dados do caixa para termo de prestação de contas' })
  async generateTermo(@Body('caixaViagemId') caixaViagemId: number) {
    if (!caixaViagemId) throw new NotFoundException('caixaViagemId é obrigatório');
    const result = await this.repo.gerarTermo(caixaViagemId);
    if (!result) throw new NotFoundException(`Caixa de viagem #${caixaViagemId} não encontrado`);
    return result;
  }

  // ── Recalcular Saldos ────────────────────────────────────────────────────────

  @Post('recalcularSaldos')
  @HttpCode(200)
  @RequirePermission('caixaviagem', 'edit')
  @ApiOperation({ summary: 'Recalcular saldoAnterior de todos os caixas de viagem' })
  async recalcularSaldos() {
    await this.repo.recalcularSaldos();
    return { message: 'Saldos recalculados com sucesso' };
  }

  // ── Ocultar ──────────────────────────────────────────────────────────────────

  @Post('ocultar')
  @HttpCode(200)
  @RequirePermission('caixaviagem', 'edit')
  @ApiOperation({ summary: 'Alternar visibilidade (oculto/visível) de um caixa' })
  async ocultar(@Body('id') id: number) {
    if (!id) throw new NotFoundException('id é obrigatório');
    const existe = await this.repo.findById(id);
    if (!existe) throw new NotFoundException(`Caixa de viagem #${id} não encontrado`);
    return this.repo.toggleOculto(id);
  }

  // ── Adiantamentos ────────────────────────────────────────────────────────────

  @Get('adiantamento')
  @HttpCode(200)
  @RequirePermission('caixaviagem', 'access')
  @ApiOperation({ summary: 'Listar adiantamentos (filtros: caixaViagemId, colaboradorId)' })
  @ApiQuery({ name: 'caixaViagemId', required: false, type: Number })
  @ApiQuery({ name: 'colaboradorId', required: false, type: Number })
  findAdiantamentos(
    @Query('caixaViagemId') caixaViagemId?: string,
    @Query('colaboradorId') colaboradorId?: string,
  ) {
    return this.repo.findAdiantamentos(
      caixaViagemId ? parseInt(caixaViagemId) : undefined,
      colaboradorId ? parseInt(colaboradorId) : undefined,
    );
  }

  @Post('adiantamento')
  @HttpCode(201)
  @RequirePermission('caixaviagem', 'edit')
  @ApiOperation({ summary: 'Criar adiantamento' })
  criarAdiantamento(@Body() dto: CriarAdiantamentoDto, @CurrentUser() user: JwtPayload) {
    return this.repo.criarAdiantamento({ ...dto, userId: dto.userId ?? user.userId });
  }

  @Put('adiantamento/:id')
  @HttpCode(200)
  @RequirePermission('caixaviagem', 'edit')
  @ApiOperation({ summary: 'Atualizar adiantamento' })
  async atualizarAdiantamento(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CriarAdiantamentoDto>,
  ) {
    const existe = await this.repo.findAdiantamentoById(id);
    if (!existe) throw new NotFoundException(`Adiantamento #${id} não encontrado`);
    return this.repo.atualizarAdiantamento(id, dto);
  }

  @Delete('adiantamento/:id')
  @HttpCode(204)
  @RequirePermission('caixaviagem', 'edit')
  @ApiOperation({ summary: 'Excluir adiantamento' })
  async excluirAdiantamento(@Param('id', ParseIntPipe) id: number) {
    const existe = await this.repo.findAdiantamentoById(id);
    if (!existe) throw new NotFoundException(`Adiantamento #${id} não encontrado`);
    await this.repo.excluirAdiantamento(id);
  }

  // ── CRUD principal ───────────────────────────────────────────────────────────

  @Get()
  @HttpCode(200)
  @RequirePermission('caixaviagem', 'access')
  @ApiOperation({ summary: 'Listar caixas de viagem do usuário logado' })
  findMinhas(@CurrentUser() user: JwtPayload) {
    return this.repo.findByUserId(user.userId);
  }

  @Post()
  @HttpCode(201)
  @RequirePermission('caixaviagem', 'edit')
  @ApiOperation({ summary: 'Criar caixa de viagem' })
  create(@Body() dto: CriarCaixaViagemDto, @CurrentUser() user: JwtPayload) {
    return this.repo.create(dto, user.userId);
  }

  @Delete(':id')
  @HttpCode(204)
  @RequirePermission('caixaviagem', 'edit')
  @ApiOperation({ summary: 'Excluir caixa de viagem e seus lançamentos/adiantamentos' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const existe = await this.repo.findById(id);
    if (!existe) throw new NotFoundException(`Caixa de viagem #${id} não encontrado`);
    await this.repo.excluir(id);
  }
}
