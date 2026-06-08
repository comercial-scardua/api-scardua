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
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from '../../auth/decorators/current-user.decorator'
import { RequirePermission } from '../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../auth/guards/permissions.guard'
import type { JwtPayload } from '../../auth/types/jwt-payload.type'
import type { AdicionarEpiCargoDto } from './dto/adicionar-epi-cargo.dto'
import type { AtualizarCargoEpiDto } from './dto/atualizar-cargo-epi.dto'
import type { AtualizarColaboradorEpiDto } from './dto/atualizar-colaborador-epi.dto'
import type { AtualizarEpiDto } from './dto/atualizar-epi.dto'
import type { CriarCargoEpiDto } from './dto/criar-cargo-epi.dto'
import type { CriarEpiDto } from './dto/criar-epi.dto'
import type { CriarMovimentacaoEpiDto } from './dto/criar-movimentacao-epi.dto'
import type { CriarMovimentacaoEstoqueDto } from './dto/criar-movimentacao-estoque.dto'
import type { CriarTransferenciaEpiDto } from './dto/criar-transferencia-epi.dto'
import type { RegistrarEntregaDto } from './dto/registrar-entrega.dto'
import { EpiRepository } from './repositories/epi.repository'
import { AtualizarCargoEpiUseCase } from './use-cases/atualizar-cargo-epi.use-case'
import { AtualizarEpiUseCase } from './use-cases/atualizar-epi.use-case'
import { AtualizarEstoqueMovimentacaoUseCase } from './use-cases/atualizar-estoque-movimentacao.use-case'
import { CriarCargoEpiLinkUseCase } from './use-cases/criar-cargo-epi-link.use-case'
import { CriarEstoqueMovimentacaoUseCase } from './use-cases/criar-estoque-movimentacao.use-case'
import { CriarMovimentacaoEpiUseCase } from './use-cases/criar-movimentacao-epi.use-case'
import { CriarTransferenciaEpiUseCase } from './use-cases/criar-transferencia-epi.use-case'
import { CargoComEpisError } from './use-cases/errors/cargo-com-epis.error'
import { EpiComVinculosError } from './use-cases/errors/epi-com-vinculos.error'
import { EstoqueInsuficienteError } from './use-cases/errors/estoque-insuficiente.error'
import { ExcluirCargoEpiUseCase } from './use-cases/excluir-cargo-epi.use-case'
import { ExcluirEpiUseCase } from './use-cases/excluir-epi.use-case'
import { ExcluirEstoqueMovimentacaoUseCase } from './use-cases/excluir-estoque-movimentacao.use-case'
import { ExcluirTransferenciaEpiUseCase } from './use-cases/excluir-transferencia-epi.use-case'
import { ListarColaboradoresEpiUseCase } from './use-cases/listar-colaboradores-epi.use-case'
import { RegistrarEntregaHistoricaUseCase } from './use-cases/registrar-entrega-historica.use-case'
import { ToggleStatusEpiUseCase } from './use-cases/toggle-status-epi.use-case'

@ApiTags('EPI')
@ApiBearerAuth()
@Controller('epi')
@UseGuards(PermissionsGuard)
export class EpiController {
  constructor(
    private repo: EpiRepository,
    private atualizarEpi: AtualizarEpiUseCase,
    private excluirEpi: ExcluirEpiUseCase,
    private toggleStatus: ToggleStatusEpiUseCase,
    private atualizarCargo: AtualizarCargoEpiUseCase,
    private excluirCargo: ExcluirCargoEpiUseCase,
    private criarCargoLink: CriarCargoEpiLinkUseCase,
    private listarColaboradores: ListarColaboradoresEpiUseCase,
    private criarMovimentacao: CriarMovimentacaoEpiUseCase,
    private historicaUseCase: RegistrarEntregaHistoricaUseCase,
    private criarEstoqueMovimentacao: CriarEstoqueMovimentacaoUseCase,
    private atualizarEstoqueMovimentacao: AtualizarEstoqueMovimentacaoUseCase,
    private excluirEstoqueMovimentacao: ExcluirEstoqueMovimentacaoUseCase,
    private criarTransferencia: CriarTransferenciaEpiUseCase,
    private excluirTransferencia: ExcluirTransferenciaEpiUseCase,
  ) {}

  // ── Perfil ────────────────────────────────────────────────────────────────

  @Get('me')
  @RequirePermission('epi', 'access')
  @ApiOperation({ summary: 'Perfil do usuário logado no contexto EPI' })
  getMe(@CurrentUser() user: JwtPayload) {
    return this.repo.findGestorPerfil(user.userId)
  }

  // ── EPIs ──────────────────────────────────────────────────────────────────

  @Get('epis')
  @RequirePermission('epi', 'access')
  @ApiOperation({ summary: 'Listar EPIs' })
  @ApiQuery({ name: 'categoria', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'baixo_estoque', required: false, type: Boolean })
  findAllEpis(
    @Query('categoria') categoria?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('baixo_estoque') baixoEstoque?: string,
  ) {
    return this.repo.findAllEpis({
      categoria,
      status,
      search,
      baixo_estoque: baixoEstoque === 'true',
    })
  }

  @Get('epis/:id')
  @RequirePermission('epi', 'access')
  @ApiOperation({ summary: 'Buscar EPI por ID com histórico' })
  async findEpiById(@Param('id', ParseIntPipe) id: number) {
    const epi = await this.repo.findEpiById(id)
    if (!epi) throw new NotFoundException(`EPI ${id} não encontrado`)
    return epi
  }

  @Post('epis')
  @HttpCode(201)
  @RequirePermission('epi', 'edit')
  @ApiOperation({ summary: 'Cadastrar EPI' })
  @ApiQuery({ name: 'empresaId', required: false, type: Number })
  createEpi(@Body() dto: CriarEpiDto, @Query('empresaId') empresaId?: string) {
    return this.repo.createEpi(dto, empresaId ? Number(empresaId) : undefined)
  }

  @Put('epis/:id')
  @RequirePermission('epi', 'edit')
  @ApiOperation({ summary: 'Atualizar EPI' })
  async updateEpi(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AtualizarEpiDto,
  ) {
    const result = await this.atualizarEpi.execute(id, dto)
    if (result.isLeft()) throw new NotFoundException(result.value.message)
    return result.value.epi
  }

  @Delete('epis/:id')
  @HttpCode(204)
  @RequirePermission('epi', 'edit')
  @ApiOperation({ summary: 'Deletar EPI' })
  async deleteEpi(@Param('id', ParseIntPipe) id: number) {
    const result = await this.excluirEpi.execute(id)
    if (result.isLeft()) {
      if (result.value instanceof EpiComVinculosError)
        throw new ConflictException(result.value.message)
      throw new NotFoundException(result.value.message)
    }
  }

  @Patch('epis/:id/status')
  @RequirePermission('epi', 'edit')
  @ApiOperation({ summary: 'Ativar / desativar EPI' })
  async toggleEpiStatus(@Param('id', ParseIntPipe) id: number) {
    const result = await this.toggleStatus.execute(id)
    if (result.isLeft()) throw new NotFoundException(result.value.message)
    return result.value.epi
  }

  // ── Cargos ────────────────────────────────────────────────────────────────

  @Get('cargos')
  @RequirePermission('epi', 'access')
  @ApiOperation({ summary: 'Listar cargos com contagens' })
  findAllCargos() {
    return this.repo.findAllCargos()
  }

  @Get('cargos/:id')
  @RequirePermission('epi', 'access')
  @ApiOperation({ summary: 'Buscar cargo por ID' })
  async findCargoById(@Param('id', ParseIntPipe) id: number) {
    const cargo = await this.repo.findCargoById(id)
    if (!cargo) throw new NotFoundException(`Cargo ${id} não encontrado`)
    return cargo
  }

  @Post('cargos')
  @HttpCode(201)
  @RequirePermission('epi', 'edit')
  @ApiOperation({ summary: 'Criar cargo EPI' })
  createCargo(@Body() dto: CriarCargoEpiDto) {
    return this.repo.createCargo(dto)
  }

  @Put('cargos/:id')
  @RequirePermission('epi', 'edit')
  @ApiOperation({ summary: 'Atualizar cargo EPI' })
  async updateCargo(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AtualizarCargoEpiDto,
  ) {
    const result = await this.atualizarCargo.execute(id, dto)
    if (result.isLeft()) throw new NotFoundException(result.value.message)
    return result.value.cargo
  }

  @Delete('cargos/:id')
  @HttpCode(204)
  @RequirePermission('epi', 'edit')
  @ApiOperation({ summary: 'Remover cargo EPI' })
  async deleteCargo(@Param('id', ParseIntPipe) id: number) {
    const result = await this.excluirCargo.execute(id)
    if (result.isLeft()) {
      if (result.value instanceof CargoComEpisError)
        throw new ConflictException(result.value.message)
      throw new NotFoundException(result.value.message)
    }
  }

  // ── Cargo-EPI links ───────────────────────────────────────────────────────

  @Get('cargo-epi')
  @RequirePermission('epi', 'access')
  @ApiOperation({ summary: 'Listar vínculos EPI × Cargo' })
  @ApiQuery({ name: 'cargo_id', required: false, type: Number })
  findCargoEpiLinks(@Query('cargo_id') cargoId?: string) {
    return this.repo.findCargoEpiLinks(cargoId ? Number(cargoId) : undefined)
  }

  @Post('cargo-epi')
  @HttpCode(201)
  @RequirePermission('epi', 'edit')
  @ApiOperation({ summary: 'Criar vínculo EPI × Cargo' })
  async createCargoEpiLink(
    @Body() dto: AdicionarEpiCargoDto & { cargo_id: number },
  ) {
    const result = await this.criarCargoLink.execute(dto)
    if (result.isLeft()) throw new ConflictException(result.value.message)
    return result.value.link
  }

  @Delete('cargo-epi/:id')
  @HttpCode(204)
  @RequirePermission('epi', 'edit')
  @ApiOperation({ summary: 'Remover vínculo EPI × Cargo por ID' })
  deleteCargoEpiLink(@Param('id', ParseIntPipe) id: number) {
    return this.repo.deleteCargoEpiLink(id)
  }

  // ── Colaboradores ─────────────────────────────────────────────────────────

  @Get('colaboradores')
  @RequirePermission('epi', 'access')
  @ApiOperation({ summary: 'Listar colaboradores no contexto EPI' })
  @ApiQuery({ name: 'empresaId', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false })
  async findColaboradores(
    @CurrentUser() user: JwtPayload,
    @Query('empresaId') empresaId?: string,
    @Query('status') status?: string,
  ) {
    const result = await this.listarColaboradores.execute(user, {
      empresaId: empresaId ? Number(empresaId) : undefined,
      status,
    })
    return result.value.colaboradores
  }

  @Put('colaboradores/:id')
  @RequirePermission('epi', 'edit')
  @ApiOperation({
    summary: 'Atualizar cargo/gestor/observações EPI do colaborador',
  })
  updateColaborador(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AtualizarColaboradorEpiDto,
  ) {
    return this.repo.updateColaboradorEpi(id, dto)
  }

  // ── Movimentações ─────────────────────────────────────────────────────────

  @Get('movimentacoes/colaborador/:id')
  @RequirePermission('epi', 'access')
  @ApiOperation({ summary: 'Histórico de movimentações do colaborador' })
  findMovimentacoesByColaborador(@Param('id', ParseIntPipe) id: number) {
    return this.repo.findMovimentacoesByColaborador(id)
  }

  @Get('movimentacoes')
  @RequirePermission('epi', 'access')
  @ApiOperation({ summary: 'Listar movimentações' })
  @ApiQuery({ name: 'colaborador_id', required: false, type: Number })
  @ApiQuery({ name: 'epi_id', required: false, type: Number })
  @ApiQuery({ name: 'tipo', required: false })
  @ApiQuery({ name: 'empresaId', required: false, type: Number })
  findMovimentacoes(
    @Query('colaborador_id') colaboradorId?: string,
    @Query('epi_id') epiId?: string,
    @Query('tipo') tipo?: string,
    @Query('empresaId') empresaId?: string,
  ) {
    return this.repo.findMovimentacoes({
      colaborador_id: colaboradorId ? Number(colaboradorId) : undefined,
      epi_id: epiId ? Number(epiId) : undefined,
      tipo,
      empresaId: empresaId ? Number(empresaId) : undefined,
    })
  }

  @Post('movimentacoes')
  @HttpCode(201)
  @RequirePermission('epi', 'edit')
  @ApiOperation({
    summary:
      'Registrar movimentação de EPI (entrega / devolução / troca / perda / baixa)',
  })
  async createMovimentacao(@Body() dto: CriarMovimentacaoEpiDto) {
    const result = await this.criarMovimentacao.execute(dto)
    if (result.isLeft()) throw new BadRequestException(result.value.message)
    return result.value.movimentacao
  }

  @Post('movimentacoes/entrega-historica')
  @HttpCode(201)
  @RequirePermission('epi', 'edit')
  @ApiOperation({
    summary: 'Registrar entrega histórica (NÃO desconta estoque)',
  })
  async registrarEntregaHistorica(@Body() dto: RegistrarEntregaDto) {
    const result = await this.historicaUseCase.execute(dto)
    if (result.isLeft()) throw new NotFoundException(result.value.message)
    return result.value.movimentacao
  }

  // ── Estoque ───────────────────────────────────────────────────────────────

  @Get('estoque')
  @RequirePermission('epi', 'access')
  @ApiOperation({
    summary: 'EPIs com situação de estoque e histórico de movimentações',
  })
  @ApiQuery({ name: 'epi_id', required: false, type: Number })
  @ApiQuery({ name: 'empresaId', required: false, type: Number })
  findEstoque(
    @Query('epi_id') epiId?: string,
    @Query('empresaId') empresaId?: string,
  ) {
    return this.repo.findEstoque({
      epi_id: epiId ? Number(epiId) : undefined,
      empresaId: empresaId ? Number(empresaId) : undefined,
    })
  }

  @Post('estoque')
  @HttpCode(201)
  @RequirePermission('epi', 'edit')
  @ApiOperation({
    summary:
      'Registrar movimentação de estoque (entrada / saída / ajuste / perda / devolução)',
  })
  async createEstoqueMovimentacao(@Body() dto: CriarMovimentacaoEstoqueDto) {
    const result = await this.criarEstoqueMovimentacao.execute(dto)
    if (result.isLeft()) throw new BadRequestException(result.value.message)
    return result.value.movimentacao
  }

  @Put('estoque/:id')
  @RequirePermission('epi', 'edit')
  @ApiOperation({ summary: 'Atualizar movimentação de estoque' })
  async updateEstoqueMovimentacao(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CriarMovimentacaoEstoqueDto>,
  ) {
    const result = await this.atualizarEstoqueMovimentacao.execute(id, dto)
    if (result.isLeft()) {
      if (result.value instanceof EstoqueInsuficienteError)
        throw new BadRequestException(result.value.message)
      throw new NotFoundException(result.value.message)
    }
    return result.value.movimentacao
  }

  @Delete('estoque/:id')
  @HttpCode(204)
  @RequirePermission('epi', 'edit')
  @ApiOperation({
    summary: 'Deletar movimentação de estoque (reverte o estoque)',
  })
  async deleteEstoqueMovimentacao(@Param('id', ParseIntPipe) id: number) {
    const result = await this.excluirEstoqueMovimentacao.execute(id)
    if (result.isLeft()) throw new NotFoundException(result.value.message)
  }

  // ── Saldo filiais ─────────────────────────────────────────────────────────

  @Get('saldo-filiais')
  @RequirePermission('epi', 'access')
  @ApiOperation({ summary: 'Saldo de EPIs por filial' })
  @ApiQuery({ name: 'empresaId', required: false, type: Number })
  findSaldoFiliais(@Query('empresaId') empresaId?: string) {
    return this.repo.findSaldoFiliais(empresaId ? Number(empresaId) : undefined)
  }

  // ── Misc ──────────────────────────────────────────────────────────────────

  @Get('produtos')
  @RequirePermission('epi', 'access')
  @ApiOperation({
    summary: 'EPIs em formato compatível com seletor de produtos',
  })
  @ApiQuery({ name: 'status', required: false })
  findProdutos(@Query('status') status?: string) {
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

  @Get('empresas')
  @RequirePermission('epi', 'access')
  @ApiOperation({ summary: 'Listar empresas/filiais' })
  findEmpresas() {
    return this.repo.findEmpresas()
  }

  @Get('responsaveis')
  @RequirePermission('epi', 'access')
  @ApiOperation({ summary: 'Listar usuários responsáveis pelo EPI' })
  findResponsaveis() {
    return this.repo.findResponsaveis()
  }

  @Get('dashboard')
  @RequirePermission('epi', 'access')
  @ApiOperation({ summary: 'Dados do dashboard EPI' })
  @ApiQuery({ name: 'empresaId', required: false, type: Number })
  findDashboard(@Query('empresaId') empresaId?: string) {
    return this.repo.findDashboard(empresaId ? Number(empresaId) : undefined)
  }

  @Get('alertas')
  @RequirePermission('epi', 'access')
  @ApiOperation({
    summary: 'Alertas: entregas vencidas, próximas e estoque baixo',
  })
  @ApiQuery({ name: 'empresaId', required: false, type: Number })
  findAlertas(@Query('empresaId') empresaId?: string) {
    return this.repo.findAlertas(empresaId ? Number(empresaId) : undefined)
  }

  // ── Transferências ────────────────────────────────────────────────────────

  @Get('transferencias')
  @RequirePermission('epi', 'access')
  @ApiOperation({ summary: 'Listar transferências entre filiais' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'dataInicio', required: false })
  @ApiQuery({ name: 'dataFim', required: false })
  findTransferencias(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
  ) {
    return this.repo.findTransferencias({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
      dataInicio,
      dataFim,
    })
  }

  @Post('transferencias')
  @HttpCode(201)
  @RequirePermission('epi', 'edit')
  @ApiOperation({ summary: 'Criar transferência de EPI entre filiais' })
  async createTransferencia(@Body() dto: CriarTransferenciaEpiDto) {
    const result = await this.criarTransferencia.execute(dto)
    if (result.isLeft()) throw new BadRequestException(result.value.message)
    return result.value.transferencia
  }

  @Delete('transferencias/:id')
  @HttpCode(204)
  @RequirePermission('epi', 'edit')
  @ApiOperation({ summary: 'Cancelar transferência' })
  async deleteTransferencia(@Param('id', ParseIntPipe) id: number) {
    const result = await this.excluirTransferencia.execute(id)
    if (result.isLeft()) throw new NotFoundException(result.value.message)
  }
}
