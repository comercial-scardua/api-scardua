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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RequirePermission } from '../../auth/decorators/require-permission.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { SupabaseService } from '../../common/supabase/supabase.service';
import { randomUUID } from 'crypto';
import type { AtualizarContratoDto } from './dto/atualizar-contrato.dto';
import type { CriarContratoDto } from './dto/criar-contrato.dto';
import { ContratosRepository } from './repositories/contratos.repository';
import { AcaoContratoUseCase } from './use-cases/acao-contrato.use-case'
import type { AcaoContrato } from './use-cases/acao-contrato.use-case';
import { AtualizarContratoUseCase } from './use-cases/atualizar-contrato.use-case';
import { BuscarContratoUseCase } from './use-cases/buscar-contrato.use-case';
import { CriarContratoUseCase } from './use-cases/criar-contrato.use-case';
import { ExcluirContratoUseCase } from './use-cases/excluir-contrato.use-case';
import { ContratoNaoEncontradoError } from './use-cases/errors/contrato-nao-encontrado.error';
import { NumeroJaCadastradoError } from './use-cases/errors/numero-ja-cadastrado.error';
import { GerenciarArquivoContratoUseCase } from './use-cases/gerenciar-arquivo-contrato.use-case';

@ApiTags('Contratos')
@ApiBearerAuth()
@Controller('contratos')
@UseGuards(PermissionsGuard)
export class ContratosController {
  constructor(
    private repo: ContratosRepository,
    private buscar: BuscarContratoUseCase,
    private criar: CriarContratoUseCase,
    private atualizar: AtualizarContratoUseCase,
    private acaoUseCase: AcaoContratoUseCase,
    private excluir: ExcluirContratoUseCase,
    private gerenciarArquivo: GerenciarArquivoContratoUseCase,
    private supabase: SupabaseService,
  ) {}

  @Get()
  @HttpCode(200)
  @RequirePermission('contratos', 'access')
  @ApiOperation({ summary: 'Listar contratos ativos e finalizados' })
  findAll() {
    return this.repo.findAll();
  }

  @Get(':id')
  @HttpCode(200)
  @RequirePermission('contratos', 'access')
  @ApiOperation({ summary: 'Buscar contrato por ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.buscar.execute(id);
    if (result.isLeft()) throw new NotFoundException(result.value.message);
    return result.value.contrato;
  }

  @Post()
  @HttpCode(201)
  @RequirePermission('contratos', 'edit')
  @ApiOperation({ summary: 'Criar contrato' })
  async create(@Body() dto: CriarContratoDto) {
    const result = await this.criar.execute(dto);

    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case NumeroJaCadastradoError:
          throw new ConflictException(error.message);
        default:
          throw new ConflictException(error.message);
      }
    }

    return result.value.contrato;
  }

  @Put(':id')
  @HttpCode(200)
  @RequirePermission('contratos', 'edit')
  @ApiOperation({ summary: 'Atualizar contrato' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AtualizarContratoDto,
  ) {
    const result = await this.atualizar.execute(id, dto);
    if (result.isLeft()) throw new NotFoundException(result.value.message);
    return result.value.contrato;
  }

  @Patch(':id')
  @HttpCode(200)
  @RequirePermission('contratos', 'edit')
  @ApiOperation({ summary: 'Ações: finalizar (toggle) ou renovar (+30 dias)' })
  async acao(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { action: AcaoContrato },
  ) {
    if (!['finalizar', 'renovar'].includes(body.action)) {
      throw new BadRequestException('Ação inválida. Use: finalizar | renovar');
    }

    const result = await this.acaoUseCase.execute(id, body.action);

    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case ContratoNaoEncontradoError:
          throw new NotFoundException(error.message);
        default:
          throw new NotFoundException(error.message);
      }
    }

    return result.value.contrato;
  }

  @Delete(':id')
  @HttpCode(204)
  @RequirePermission('contratos', 'edit')
  @ApiOperation({ summary: 'Excluir contrato (soft delete — status = excluido)' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const result = await this.excluir.execute(id);
    if (result.isLeft()) throw new NotFoundException(result.value.message);
  }

  @Post(':id/arquivos')
  @HttpCode(201)
  @RequirePermission('contratos', 'edit')
  @UseInterceptors(FileInterceptor('arquivo', { limits: { fileSize: 10 * 1024 * 1024 } }))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Adicionar arquivo ao contrato (max 10MB)' })
  async adicionarArquivo(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Arquivo obrigatório');

    const result = await this.gerenciarArquivo.adicionar(id, file);
    if (result.isLeft()) throw new NotFoundException(result.value.message);
    return result.value;
  }

  @Delete(':id/arquivos/:arquivoId')
  @HttpCode(204)
  @RequirePermission('contratos', 'edit')
  @ApiOperation({ summary: 'Remover arquivo do contrato' })
  async removerArquivo(
    @Param('id', ParseIntPipe) id: number,
    @Param('arquivoId', ParseIntPipe) arquivoId: number,
  ) {
    const result = await this.gerenciarArquivo.remover(id, arquivoId);
    if (result.isLeft()) throw new NotFoundException(result.value.message);
  }

  @Post('upload-url')
  @HttpCode(200)
  @RequirePermission('contratos', 'edit')
  @ApiOperation({ summary: 'Gerar URL assinada para upload direto ao Supabase' })
  async uploadUrl(@Body('path') path?: string) {
    const filePath = path ?? `contratos/${Date.now()}_${randomUUID().slice(0, 8)}`;
    return this.supabase.getSignedUploadUrl('uploads', filePath);
  }
}
