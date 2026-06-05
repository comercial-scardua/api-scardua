import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
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
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { RequirePermission } from '../../auth/decorators/require-permission.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import type { JwtPayload } from '../../auth/types/jwt-payload.type';
import type { AtualizarManualDto } from './dto/atualizar-manual.dto';
import type { CriarManualDto } from './dto/criar-manual.dto';
import type { ManuaisRepository } from './repositories/manuais.repository';
import type { AtualizarManualUseCase } from './use-cases/atualizar-manual.use-case';
import type { BuscarManualUseCase } from './use-cases/buscar-manual.use-case';
import type { CriarManualUseCase } from './use-cases/criar-manual.use-case';
import type { DesativarManualUseCase } from './use-cases/desativar-manual.use-case';
import type { GerenciarArquivoManualUseCase } from './use-cases/gerenciar-arquivo-manual.use-case';

@ApiTags('Manuais')
@ApiBearerAuth()
@Controller('manuais')
@UseGuards(PermissionsGuard)
export class ManuaisController {
  constructor(
    private repo: ManuaisRepository,
    private buscar: BuscarManualUseCase,
    private criar: CriarManualUseCase,
    private atualizar: AtualizarManualUseCase,
    private desativar: DesativarManualUseCase,
    private gerenciarArquivo: GerenciarArquivoManualUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  @RequirePermission('manuais', 'access')
  @ApiOperation({ summary: 'Listar manuais ativos (sem descrição)' })
  findAll() {
    return this.repo.findAll();
  }

  @Get(':id')
  @HttpCode(200)
  @RequirePermission('manuais', 'access')
  @ApiOperation({ summary: 'Buscar manual por ID (com descrição e arquivos)' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.buscar.execute(id);
    if (result.isLeft()) throw new NotFoundException(result.value.message);
    return result.value.manual;
  }

  @Post()
  @HttpCode(201)
  @RequirePermission('manuais', 'edit')
  @ApiOperation({ summary: 'Criar manual' })
  async create(@Body() dto: CriarManualDto, @CurrentUser() user: JwtPayload) {
    const result = await this.criar.execute(dto, user.email);
    return result.value;
  }

  @Put(':id')
  @HttpCode(200)
  @RequirePermission('manuais', 'edit')
  @ApiOperation({ summary: 'Atualizar manual' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AtualizarManualDto,
  ) {
    const result = await this.atualizar.execute(id, dto);
    if (result.isLeft()) throw new NotFoundException(result.value.message);
    return result.value.manual;
  }

  @Delete(':id')
  @HttpCode(204)
  @RequirePermission('manuais', 'edit')
  @ApiOperation({ summary: 'Desativar manual (soft delete)' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const result = await this.desativar.execute(id);
    if (result.isLeft()) throw new NotFoundException(result.value.message);
  }

  @Post(':id/arquivos')
  @HttpCode(201)
  @RequirePermission('manuais', 'edit')
  @UseInterceptors(FileInterceptor('arquivo', { limits: { fileSize: 50 * 1024 * 1024 } }))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Adicionar arquivo ao manual (max 50MB)' })
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
  @RequirePermission('manuais', 'edit')
  @ApiOperation({ summary: 'Remover arquivo do manual' })
  async removerArquivo(
    @Param('id', ParseIntPipe) id: number,
    @Param('arquivoId', ParseIntPipe) arquivoId: number,
  ) {
    const result = await this.gerenciarArquivo.remover(id, arquivoId);
    if (result.isLeft()) throw new NotFoundException(result.value.message);
  }
}
