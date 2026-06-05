import {
  Body,
  Controller,
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
import type { PrismaService } from '../../prisma/prisma.service';
import type { AtualizarPatrimonioDto } from './dto/atualizar-patrimonio.dto';
import type { CriarPatrimonioDto } from './dto/criar-patrimonio.dto';
import type { PatrimoniosRepository } from './repositories/patrimonios.repository';
import type { AlternarVisibilidadePatrimonioUseCase } from './use-cases/alternar-visibilidade-patrimonio.use-case';
import type { AtualizarPatrimonioUseCase } from './use-cases/atualizar-patrimonio.use-case';
import type { BuscarPatrimonioUseCase } from './use-cases/buscar-patrimonio.use-case';

@ApiTags('Patrimônios')
@ApiBearerAuth()
@Controller('patrimonio')
@UseGuards(PermissionsGuard)
export class PatrimoniosController {
  constructor(
    private repo: PatrimoniosRepository,
    private buscar: BuscarPatrimonioUseCase,
    private atualizar: AtualizarPatrimonioUseCase,
    private alternarVisibilidade: AlternarVisibilidadePatrimonioUseCase,
    private prisma: PrismaService,
  ) {}

  @Get()
  @HttpCode(200)
  @RequirePermission('patrimonio', 'access')
  @ApiOperation({ summary: 'Listar patrimônios' })
  @ApiQuery({ name: 'showHidden', required: false, type: Boolean })
  findAll(@Query('showHidden') showHidden?: boolean) {
    return this.repo.findAll(showHidden);
  }

  @Get('veiculos')
  @HttpCode(200)
  @ApiOperation({ summary: 'Listar veículos (para seletores)' })
  findVeiculos() {
    return this.repo.findVeiculos();
  }

  @Get('stats')
  @HttpCode(200)
  @RequirePermission('patrimonio', 'access')
  @ApiOperation({ summary: 'Estatísticas por tipo, setor e movimentações por mês' })
  stats() {
    return this.repo.stats();
  }

  @Get('check-serial')
  @HttpCode(200)
  @ApiOperation({ summary: 'Verificar se número de série já existe' })
  @ApiQuery({ name: 'serial', required: true })
  @ApiQuery({ name: 'skipId', required: false, type: Number })
  async checkSerial(
    @Query('serial') serial: string,
    @Query('skipId') skipId?: number,
  ) {
    const patrimonio = await this.repo.findBySerial(serial, skipId);
    return { exists: !!patrimonio, patrimonio: patrimonio ?? null };
  }

  @Get(':id')
  @HttpCode(200)
  @RequirePermission('patrimonio', 'access')
  @ApiOperation({ summary: 'Buscar patrimônio por ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.buscar.execute(id);
    if (result.isLeft()) throw new NotFoundException(result.value.message);
    return result.value.patrimonio;
  }

  @Post()
  @HttpCode(201)
  @RequirePermission('patrimonio', 'edit')
  @ApiOperation({ summary: 'Criar patrimônio' })
  create(@Body() dto: CriarPatrimonioDto) {
    return this.repo.create(dto);
  }

  @Patch(':id')
  @HttpCode(200)
  @RequirePermission('patrimonio', 'edit')
  @ApiOperation({ summary: 'Atualizar patrimônio (cria movimentação automática se houver mudança de responsável/localização/km)' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AtualizarPatrimonioDto,
    @CurrentUser() user: JwtPayload,
  ) {
    // Busca o colaborador vinculado ao usuário logado para usar como autorId na movimentação
    const colaborador = await this.prisma.colaboradores.findFirst({
      where: { userId: user.userId },
      select: { id: true },
    });

    const result = await this.atualizar.execute(id, dto, colaborador?.id ?? null);
    if (result.isLeft()) throw new NotFoundException(result.value.message);

    return this.repo.findById(id);
  }

  @Put(':id')
  @HttpCode(200)
  @RequirePermission('patrimonio', 'edit')
  @ApiOperation({ summary: 'Alternar visibilidade do patrimônio (oculto/visível)' })
  async toggleOculto(@Param('id', ParseIntPipe) id: number) {
    const result = await this.alternarVisibilidade.execute(id);
    if (result.isLeft()) throw new NotFoundException(result.value.message);
    return result.value;
  }
}
