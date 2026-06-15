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
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { RequirePermission } from '../../auth/decorators/require-permission.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import type { JwtPayload } from '../../auth/types/jwt-payload.type';
import { PrismaService } from '../../prisma/prisma.service';
import type { CriarColaboradorDto } from './dto/criar-colaborador.dto';
import { ColaboradoresRepository } from './repositories/colaboradores.repository';
import { AtualizarColaboradorUseCase } from './use-cases/atualizar-colaborador.use-case';
import { AtualizarFotoColaboradorUseCase } from './use-cases/atualizar-foto-colaborador.use-case';
import { BuscarColaboradorUseCase } from './use-cases/buscar-colaborador.use-case';
import { CriarColaboradorUseCase } from './use-cases/criar-colaborador.use-case';
import { DesativarColaboradorUseCase } from './use-cases/desativar-colaborador.use-case';
import { CpfJaCadastradoError } from './use-cases/errors/cpf-ja-cadastrado.error';
import { ListarColaboradoresUseCase } from './use-cases/listar-colaboradores.use-case';

@ApiTags('Colaboradores')
@ApiBearerAuth()
@Controller('colaboradores')
@UseGuards(PermissionsGuard)
export class ColaboradoresController {
  constructor(
    private listar: ListarColaboradoresUseCase,
    private buscar: BuscarColaboradorUseCase,
    private criar: CriarColaboradorUseCase,
    private atualizar: AtualizarColaboradorUseCase,
    private desativar: DesativarColaboradorUseCase,
    private atualizarFoto: AtualizarFotoColaboradorUseCase,
    private repo: ColaboradoresRepository,
    private prisma: PrismaService,
  ) {}

  @Get()
  @HttpCode(200)
  @RequirePermission('colaboradores', 'access')
  @ApiOperation({ summary: 'Listar colaboradores' })
  @ApiQuery({ name: 'cpf', required: false })
  @ApiQuery({ name: 'simple', required: false, type: Boolean })
  findAll(@Query('cpf') cpf?: string, @Query('simple') simple?: boolean) {
    return this.listar.execute(cpf, simple);
  }

  @Get('me')
  @HttpCode(200)
  @ApiOperation({ summary: 'Perfil do colaborador logado' })
  findMe(@CurrentUser() user: JwtPayload) {
    return this.repo.findByUserId(user.userId);
  }

  @Put()
  @HttpCode(200)
  @RequirePermission('colaboradores', 'edit')
  @ApiOperation({ summary: 'Atualizar colaborador (id no body — padrão legado)' })
  async updateByBody(@Body() dto: Partial<CriarColaboradorDto> & { id: number }) {
    if (!dto.id) throw new BadRequestException('id é obrigatório no body');
    const result = await this.atualizar.execute(dto.id, dto);
    if (result.isLeft()) throw new NotFoundException(result.value.message);
    return result.value.colaborador;
  }

  @Get(':id')
  @HttpCode(200)
  @RequirePermission('colaboradores', 'access')
  @ApiOperation({ summary: 'Buscar colaborador por ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.buscar.execute(id);

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message);
    }

    return result.value.colaborador;
  }

  @Post()
  @HttpCode(201)
  @RequirePermission('colaboradores', 'edit')
  @ApiOperation({ summary: 'Criar colaborador' })
  async create(@Body() dto: CriarColaboradorDto) {
    const result = await this.criar.execute(dto);

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case CpfJaCadastradoError:
          throw new ConflictException(error.message);
        default:
          throw new ConflictException(error.message);
      }
    }

    return result.value;
  }

  @Patch(':id')
  @HttpCode(200)
  @RequirePermission('colaboradores', 'edit')
  @ApiOperation({ summary: 'Atualizar colaborador' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CriarColaboradorDto>,
  ) {
    const result = await this.atualizar.execute(id, dto);

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message);
    }

    return result.value.colaborador;
  }

  @Patch(':id/foto')
  @HttpCode(200)
  @RequirePermission('colaboradores', 'edit')
  @UseInterceptors(FileInterceptor('foto', { limits: { fileSize: 5 * 1024 * 1024 } }))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Atualizar foto do colaborador (upload para Supabase)' })
  async updateFoto(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Arquivo de foto é obrigatório');

    const result = await this.atualizarFoto.execute(id, file);

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message);
    }

    return { fotoUrl: result.value.fotoUrl };
  }

  @Delete(':id')
  @HttpCode(204)
  @RequirePermission('colaboradores', 'edit')
  @ApiOperation({ summary: 'Desativar colaborador (soft delete)' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const result = await this.desativar.execute(id);

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message);
    }
  }

  @Get(':id/foto')
  @HttpCode(200)
  @RequirePermission('colaboradores', 'access')
  @ApiOperation({ summary: 'Obter URL da foto do colaborador' })
  async getFoto(@Param('id', ParseIntPipe) id: number) {
    const colaborador = await this.repo.findById(id);
    if (!colaborador) throw new NotFoundException(`Colaborador #${id} não encontrado`);
    return { fotoUrl: (colaborador as any).foto ?? null };
  }

  @Get(':id/termos')
  @HttpCode(200)
  @RequirePermission('colaboradores', 'access')
  @ApiOperation({ summary: 'Listar termos assinados pelo colaborador' })
  async findTermos(@Param('id', ParseIntPipe) id: number) {
    const colaborador = await this.repo.findById(id);
    if (!colaborador) throw new NotFoundException(`Colaborador #${id} não encontrado`);

    return this.prisma.termos_assinados.findMany({
      where: { colaboradorId: id },
      orderBy: { createdAt: 'desc' },
    });
  }
}
