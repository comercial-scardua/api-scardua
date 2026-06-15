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

  @Post('todos')
  @HttpCode(201)
  @RequirePermission('contacorrentetodos', 'access')
  @ApiOperation({ summary: 'Criar conta corrente (via rota /todos)' })
  createViaTodos(@Body() dto: CriarContaCorrenteDto, @CurrentUser() user: JwtPayload) {
    return this.repo.create(dto, user.userId);
  }

  @Put('todos')
  @HttpCode(200)
  @RequirePermission('contacorrentetodos', 'access')
  @ApiOperation({ summary: 'Atualizar conta corrente (id no body, via rota /todos)' })
  async updateViaTodos(@Body() body: Partial<CriarContaCorrenteDto> & { id: number }) {
    if (!body.id) throw new NotFoundException('id é obrigatório no body');
    const existe = await this.repo.findById(body.id);
    if (!existe) throw new NotFoundException(`Conta corrente #${body.id} não encontrada`);
    return this.repo.update(body.id, body);
  }

  @Get('usuario/:userId')
  @HttpCode(200)
  @RequirePermission('contacorrente', 'access')
  @ApiOperation({ summary: 'Contas correntes de um usuário específico' })
  findByUsuario(@Param('userId') userId: string) {
    return this.repo.findByUserId(userId);
  }

  @Post('usuario/:userId')
  @HttpCode(201)
  @RequirePermission('contacorrente', 'access')
  @ApiOperation({ summary: 'Criar conta corrente para um usuário específico' })
  createForUsuario(@Param('userId') userId: string, @Body() dto: CriarContaCorrenteDto) {
    return this.repo.create(dto, userId);
  }

  @Put('usuario/:userId')
  @HttpCode(200)
  @RequirePermission('contacorrente', 'access')
  @ApiOperation({ summary: 'Atualizar conta corrente de um usuário (id no body)' })
  async updateForUsuario(
    @Param('userId') userId: string,
    @Body() body: Partial<CriarContaCorrenteDto> & { id: number },
  ) {
    if (!body.id) throw new NotFoundException('id é obrigatório no body');
    const existe = await this.repo.findById(body.id);
    if (!existe) throw new NotFoundException(`Conta corrente #${body.id} não encontrada`);
    return this.repo.update(body.id, body);
  }

  @Get('resumo/:userId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Resumo financeiro de um usuário' })
  resumo(@Param('userId') userId: string) {
    return this.repo.resumo(userId);
  }

  @Post('resumo/:userId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Resumo financeiro de um usuário (POST alias)' })
  resumoPost(@Param('userId') userId: string) {
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

  @Post('ocultar')
  @HttpCode(200)
  @RequirePermission('contacorrente', 'access')
  @ApiOperation({ summary: 'Ocultar/exibir conta corrente por ID (via body)' })
  async ocultar(@Body('id') id: number) {
    if (!id) throw new NotFoundException('id é obrigatório');
    const existe = await this.repo.findById(id);
    if (!existe) throw new NotFoundException(`Conta corrente #${id} não encontrada`);
    return this.repo.toggleOculto(id);
  }

  @Post('generate-termo')
  @HttpCode(200)
  @RequirePermission('contacorrente', 'access')
  @ApiOperation({ summary: 'Gerar termo de conta corrente em JSON' })
  async generateTermo(@Body('userId') userId: string) {
    if (!userId) throw new NotFoundException('userId é obrigatório');
    const contas = await this.repo.findByUserId(userId);
    const resumo = await this.repo.resumo(userId);

    return {
      titulo: 'Termo de Conta Corrente',
      dataGeracao: new Date().toISOString(),
      userId,
      resumo,
      contas,
    };
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
