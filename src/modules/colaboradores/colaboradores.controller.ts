import {
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
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { RequirePermission } from '../../auth/decorators/require-permission.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import type { JwtPayload } from '../../auth/types/jwt-payload.type';
import type { CriarColaboradorDto } from './dto/criar-colaborador.dto';
import type { ColaboradoresRepository } from './repositories/colaboradores.repository';
import type { AtualizarColaboradorUseCase } from './use-cases/atualizar-colaborador.use-case';
import type { BuscarColaboradorUseCase } from './use-cases/buscar-colaborador.use-case';
import type { CriarColaboradorUseCase } from './use-cases/criar-colaborador.use-case';
import type { DesativarColaboradorUseCase } from './use-cases/desativar-colaborador.use-case';
import { CpfJaCadastradoError } from './use-cases/errors/cpf-ja-cadastrado.error';
import type { ListarColaboradoresUseCase } from './use-cases/listar-colaboradores.use-case';

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
    private repo: ColaboradoresRepository,
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
}
