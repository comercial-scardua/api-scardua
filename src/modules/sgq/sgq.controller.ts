import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../auth/guards/permissions.guard'
import type { CriarDocumentoSgqDto } from './dto/criar-documento-sgq.dto'
import type { CriarNcSgqDto } from './dto/criar-nc-sgq.dto'
import type { CriarProcessoSgqDto } from './dto/criar-processo-sgq.dto'
import { SgqRepository } from './repositories/sgq.repository'

@ApiTags('SGQ')
@ApiBearerAuth()
@Controller('sgq')
@UseGuards(PermissionsGuard)
export class SgqController {
  constructor(private repo: SgqRepository) {}

  // ── Documentos ────────────────────────────────────────────────────────────

  @Get('documents')
  @HttpCode(200)
  @RequirePermission('sgq', 'access')
  @ApiOperation({ summary: 'Listar documentos SGQ' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'processId', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false })
  async listDocuments(
    @Query('status') status?: string,
    @Query('type') type?: string,
    @Query('processId', new ParseIntPipe({ optional: true })) processId?: number,
    @Query('search') search?: string,
  ) {
    return this.repo.findAllDocumentos({ status, type, processId, search })
  }

  @Post('documents')
  @HttpCode(201)
  @RequirePermission('sgq', 'edit')
  @ApiOperation({ summary: 'Criar documento SGQ' })
  async createDocument(@Body() dto: CriarDocumentoSgqDto) {
    return this.repo.createDocumento(dto)
  }

  @Get('documents/:id')
  @HttpCode(200)
  @RequirePermission('sgq', 'access')
  @ApiOperation({ summary: 'Buscar documento SGQ por ID' })
  async findDocument(@Param('id', ParseIntPipe) id: number) {
    const doc = await this.repo.findDocumentoById(id)
    if (!doc) throw new NotFoundException(`Documento #${id} não encontrado`)
    return doc
  }

  @Post('documents/:id')
  @HttpCode(200)
  @RequirePermission('sgq', 'edit')
  @ApiOperation({ summary: 'Atualizar documento SGQ' })
  async updateDocument(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CriarDocumentoSgqDto>,
  ) {
    const doc = await this.repo.findDocumentoById(id)
    if (!doc) throw new NotFoundException(`Documento #${id} não encontrado`)
    return this.repo.updateDocumento(id, dto)
  }

  // ── Processos ─────────────────────────────────────────────────────────────

  @Get('processes')
  @HttpCode(200)
  @RequirePermission('sgq', 'access')
  @ApiOperation({ summary: 'Listar processos SGQ' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'search', required: false })
  async listProcesses(
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.repo.findAllProcessos({ status, search })
  }

  @Post('processes')
  @HttpCode(201)
  @RequirePermission('sgq', 'edit')
  @ApiOperation({ summary: 'Criar processo SGQ' })
  async createProcess(@Body() dto: CriarProcessoSgqDto) {
    return this.repo.createProcesso(dto)
  }

  // ── Não-Conformidades ─────────────────────────────────────────────────────

  @Get('non-conformities')
  @HttpCode(200)
  @RequirePermission('sgq', 'access')
  @ApiOperation({ summary: 'Listar não-conformidades SGQ' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'origin', required: false })
  @ApiQuery({ name: 'processId', required: false, type: Number })
  async listNCs(
    @Query('status') status?: string,
    @Query('origin') origin?: string,
    @Query('processId', new ParseIntPipe({ optional: true })) processId?: number,
  ) {
    return this.repo.findAllNCs({ status, origin, processId })
  }

  @Post('non-conformities')
  @HttpCode(201)
  @RequirePermission('sgq', 'edit')
  @ApiOperation({ summary: 'Criar não-conformidade SGQ' })
  async createNC(@Body() dto: CriarNcSgqDto) {
    return this.repo.createNC(dto)
  }

  // ── Files ─────────────────────────────────────────────────────────────────

  @Get('files')
  @HttpCode(200)
  @RequirePermission('sgq', 'access')
  @ApiOperation({ summary: 'Listar arquivos anexados aos documentos SGQ' })
  async listFiles() {
    return this.repo.findDocumentosComArquivo()
  }

  @Post('files')
  @HttpCode(200)
  @RequirePermission('sgq', 'edit')
  @ApiOperation({ summary: 'Operação de arquivo SGQ (não disponível via API direta)' })
  async uploadFile() {
    return { message: 'Operação de arquivo não disponível via API direta' }
  }

  @Delete('files')
  @HttpCode(200)
  @RequirePermission('sgq', 'edit')
  @ApiOperation({ summary: 'Deletar arquivo SGQ (não disponível via API direta)' })
  async deleteFile() {
    return { message: 'Operação de arquivo não disponível via API direta' }
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────

  @Get('dashboard')
  @HttpCode(200)
  @RequirePermission('sgq', 'access')
  @ApiOperation({ summary: 'Dashboard SGQ com estatísticas agregadas' })
  async getDashboard() {
    return this.repo.getDashboard()
  }

  // ── Help ──────────────────────────────────────────────────────────────────

  @Get('help')
  @HttpCode(200)
  @RequirePermission('sgq', 'access')
  @ApiOperation({ summary: 'Listar artigos de ajuda SGQ' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'module', required: false })
  async listHelp(
    @Query('category') category?: string,
    @Query('module') module?: string,
  ) {
    return this.repo.findHelpArticles({ category, module })
  }
}
