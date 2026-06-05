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
import type { AtualizarNcmDto } from './dto/atualizar-ncm.dto';
import type { CriarNcmDto } from './dto/criar-ncm.dto';
import type { AtualizarNcmUseCase } from './use-cases/atualizar-ncm.use-case';
import type { BuscarNcmUseCase } from './use-cases/buscar-ncm.use-case';
import type { CriarNcmUseCase } from './use-cases/criar-ncm.use-case';
import type { DesativarNcmUseCase } from './use-cases/desativar-ncm.use-case';
import { NcmDuplicadoError } from './use-cases/errors/ncm-duplicado.error';
import type { ImportarNcmUseCase } from './use-cases/importar-ncm.use-case';
import type { ListarNcmUseCase } from './use-cases/listar-ncm.use-case';

@ApiTags('NCM')
@ApiBearerAuth()
@Controller('ncm')
@UseGuards(PermissionsGuard)
export class NcmController {
  constructor(
    private listar: ListarNcmUseCase,
    private buscar: BuscarNcmUseCase,
    private criar: CriarNcmUseCase,
    private atualizar: AtualizarNcmUseCase,
    private desativar: DesativarNcmUseCase,
    private importar: ImportarNcmUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  @RequirePermission('ncm', 'access')
  @ApiOperation({ summary: 'Listar NCMs ativos com filtros' })
  @ApiQuery({ name: 'termo', required: false })
  @ApiQuery({ name: 'categoria', required: false })
  @ApiQuery({ name: 'empresa', required: false })
  @ApiQuery({ name: 'uf_emissor', required: false })
  @ApiQuery({ name: 'uf_destino', required: false })
  findAll(
    @Query('termo') termo?: string,
    @Query('categoria') categoria?: string,
    @Query('empresa') empresa?: string,
    @Query('uf_emissor') uf_emissor?: string,
    @Query('uf_destino') uf_destino?: string,
  ) {
    return this.listar.execute({ termo, categoria, empresa, uf_emissor, uf_destino });
  }

  @Get(':id')
  @HttpCode(200)
  @RequirePermission('ncm', 'access')
  @ApiOperation({ summary: 'Buscar NCM por ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.buscar.execute(id);
    if (result.isLeft()) throw new NotFoundException(result.value.message);
    return result.value.ncm;
  }

  @Post()
  @HttpCode(201)
  @RequirePermission('ncm', 'edit')
  @ApiOperation({ summary: 'Criar NCM' })
  async create(@Body() dto: CriarNcmDto, @CurrentUser() user: JwtPayload) {
    const result = await this.criar.execute(dto, user.email);

    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case NcmDuplicadoError:
          throw new ConflictException(error.message);
        default:
          throw new ConflictException(error.message);
      }
    }

    return result.value.ncm;
  }

  @Post('import')
  @HttpCode(200)
  @RequirePermission('ncm', 'edit')
  @ApiOperation({ summary: 'Importar NCMs em lote (upsert)' })
  async importarLote(
    @Body() body: { itens: CriarNcmDto[] },
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.importar.execute(body.itens, user.email);
    return result.value;
  }

  @Patch(':id')
  @HttpCode(200)
  @RequirePermission('ncm', 'edit')
  @ApiOperation({ summary: 'Atualizar campos fiscais de um NCM' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AtualizarNcmDto,
  ) {
    const result = await this.atualizar.execute(id, dto);
    if (result.isLeft()) throw new NotFoundException(result.value.message);
    return result.value.ncm;
  }

  @Delete(':id')
  @HttpCode(204)
  @RequirePermission('ncm', 'edit')
  @ApiOperation({ summary: 'Desativar NCM (soft delete)' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const result = await this.desativar.execute(id);
    if (result.isLeft()) throw new NotFoundException(result.value.message);
  }
}
