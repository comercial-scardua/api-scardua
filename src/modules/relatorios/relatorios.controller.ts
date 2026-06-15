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
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RequirePermission } from '../../auth/decorators/require-permission.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import type { CriarRelatorioDto } from './dto/criar-relatorio.dto';
import { RelatoriosRepository } from './repositories/relatorios.repository';

@ApiTags('Relatorios')
@ApiBearerAuth()
@Controller('relatorios')
@UseGuards(PermissionsGuard)
export class RelatoriosController {
  constructor(private repo: RelatoriosRepository) {}

  @Get()
  @HttpCode(200)
  @RequirePermission('relatorios', 'access')
  @ApiOperation({ summary: 'Listar relatorios ativos' })
  @ApiQuery({ name: 'departamento', required: false })
  @ApiQuery({ name: 'restrito', required: false, type: Boolean })
  @ApiQuery({ name: 'search', required: false })
  findAll(
    @Query('departamento') departamento?: string,
    @Query('restrito') restrito?: string,
    @Query('search') search?: string,
  ) {
    const restritoFilter =
      restrito === 'true' ? true : restrito === 'false' ? false : undefined;
    return this.repo.findAll({ departamento, restrito: restritoFilter, search });
  }

  @Post()
  @HttpCode(201)
  @RequirePermission('relatorios', 'edit')
  @ApiOperation({ summary: 'Criar relatorio' })
  create(@Body() dto: CriarRelatorioDto) {
    return this.repo.create(dto);
  }

  // ── Rotas estáticas devem vir ANTES das paramétricas (:id) ───────────────

  @Post('execute')
  @HttpCode(200)
  @RequirePermission('relatorios', 'access')
  @ApiOperation({ summary: 'Executar query SQL do relatorio (via Oracle bridge)' })
  async execute(
    @Body('id') id: number,
    @Body('parametros') parametros?: Record<string, unknown>,
  ) {
    if (!id) throw new NotFoundException('id é obrigatório');
    const relatorio = await this.repo.findById(id);
    if (!relatorio) throw new NotFoundException(`Relatorio #${id} não encontrado`);
    return {
      sql: relatorio.query_sql,
      parametros,
      message: 'Execute via Oracle bridge',
    };
  }

  // ── Rotas paramétricas ────────────────────────────────────────────────────

  @Get(':id')
  @HttpCode(200)
  @RequirePermission('relatorios', 'access')
  @ApiOperation({ summary: 'Buscar relatorio por ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const relatorio = await this.repo.findById(id);
    if (!relatorio) throw new NotFoundException(`Relatorio #${id} não encontrado`);
    return relatorio;
  }

  @Post(':id')
  @HttpCode(200)
  @RequirePermission('relatorios', 'edit')
  @ApiOperation({ summary: 'Atualizar relatorio' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CriarRelatorioDto>,
  ) {
    const exists = await this.repo.findById(id);
    if (!exists) throw new NotFoundException(`Relatorio #${id} não encontrado`);
    return this.repo.update(id, dto);
  }

  @Patch(':id')
  @HttpCode(200)
  @RequirePermission('relatorios', 'edit')
  @ApiOperation({ summary: 'Atualizar relatorio (PATCH)' })
  async patch(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CriarRelatorioDto>,
  ) {
    const exists = await this.repo.findById(id);
    if (!exists) throw new NotFoundException(`Relatorio #${id} não encontrado`);
    return this.repo.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(200)
  @RequirePermission('relatorios', 'edit')
  @ApiOperation({ summary: 'Excluir relatorio (soft delete — ativo: false)' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const exists = await this.repo.findById(id);
    if (!exists) throw new NotFoundException(`Relatorio #${id} não encontrado`);
    await this.repo.remove(id);
    return { success: true, message: `Relatorio #${id} excluído` };
  }

  @Get(':id/permissions')
  @HttpCode(200)
  @RequirePermission('relatorios', 'access')
  @ApiOperation({ summary: 'Listar permissões de visualização do relatorio' })
  async getPermissions(@Param('id', ParseIntPipe) id: number) {
    const exists = await this.repo.findById(id);
    if (!exists) throw new NotFoundException(`Relatorio #${id} não encontrado`);
    return this.repo.getPermissions(id);
  }

  @Post(':id/permissions')
  @HttpCode(200)
  @RequirePermission('relatorios', 'edit')
  @ApiOperation({ summary: 'Definir permissões de visualização do relatorio' })
  async setPermissions(
    @Param('id', ParseIntPipe) id: number,
    @Body('userIds') userIds: string[],
  ) {
    const exists = await this.repo.findById(id);
    if (!exists) throw new NotFoundException(`Relatorio #${id} não encontrado`);
    return this.repo.setPermissions(id, userIds ?? []);
  }
}
