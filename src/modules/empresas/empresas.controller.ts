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
import type { AtualizarEmpresaDto } from './dto/atualizar-empresa.dto';
import type { CriarEmpresaDto } from './dto/criar-empresa.dto';
import type { EmpresasRepository } from './repositories/empresas.repository';
import type { AtualizarEmpresaUseCase } from './use-cases/atualizar-empresa.use-case';
import type { BuscarEmpresaUseCase } from './use-cases/buscar-empresa.use-case';
import type { CriarEmpresaUseCase } from './use-cases/criar-empresa.use-case';
import type { DesativarEmpresaUseCase } from './use-cases/desativar-empresa.use-case';
import { CnpjJaCadastradoError } from './use-cases/errors/cnpj-ja-cadastrado.error';
import type { ListarEmpresasUseCase } from './use-cases/listar-empresas.use-case';

@ApiTags('Empresas')
@ApiBearerAuth()
@Controller('empresas')
@UseGuards(PermissionsGuard)
export class EmpresasController {
  constructor(
    private listar: ListarEmpresasUseCase,
    private buscar: BuscarEmpresaUseCase,
    private criar: CriarEmpresaUseCase,
    private atualizar: AtualizarEmpresaUseCase,
    private desativar: DesativarEmpresaUseCase,
    private repo: EmpresasRepository,
  ) {}

  @Get()
  @HttpCode(200)
  @RequirePermission('empresas', 'access')
  @ApiOperation({ summary: 'Listar empresas com paginação e busca' })
  @ApiQuery({ name: 'searchTerm', required: false })
  @ApiQuery({ name: 'mostrarOcultos', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('searchTerm') searchTerm?: string,
    @Query('mostrarOcultos') mostrarOcultos?: boolean,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.listar.execute({ searchTerm, mostrarOcultos, page, limit });
  }

  @Get('list')
  @HttpCode(200)
  @ApiOperation({ summary: 'Lista simples para dropdowns' })
  findSimple() {
    return this.repo.findSimple();
  }

  @Get(':id')
  @HttpCode(200)
  @RequirePermission('empresas', 'access')
  @ApiOperation({ summary: 'Buscar empresa por ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.buscar.execute(id);

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message);
    }

    return result.value.empresa;
  }

  @Post()
  @HttpCode(201)
  @RequirePermission('empresas', 'edit')
  @ApiOperation({ summary: 'Criar empresa' })
  async create(
    @Body() dto: CriarEmpresaDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.criar.execute(dto, user.userId);

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case CnpjJaCadastradoError:
          throw new ConflictException(error.message);
        default:
          throw new ConflictException(error.message);
      }
    }

    return result.value.empresa;
  }

  @Patch(':id')
  @HttpCode(200)
  @RequirePermission('empresas', 'edit')
  @ApiOperation({ summary: 'Atualizar empresa' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AtualizarEmpresaDto,
  ) {
    const result = await this.atualizar.execute(id, dto);

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case CnpjJaCadastradoError:
          throw new ConflictException(error.message);
        default:
          throw new NotFoundException(error.message);
      }
    }

    return result.value.empresa;
  }

  @Delete(':id')
  @HttpCode(204)
  @RequirePermission('empresas', 'edit')
  @ApiOperation({ summary: 'Desativar empresa (soft delete)' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const result = await this.desativar.execute(id);

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message);
    }
  }
}
