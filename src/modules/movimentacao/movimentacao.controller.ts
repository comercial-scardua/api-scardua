import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { RequirePermission } from '../../auth/decorators/require-permission.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import type { JwtPayload } from '../../auth/types/jwt-payload.type';
import type { CriarMovimentacaoDto } from './dto/criar-movimentacao.dto';
import { MovimentacaoRepository } from './repositories/movimentacao.repository';

@ApiTags('Movimentação')
@ApiBearerAuth()
@Controller('movimentacao')
@UseGuards(PermissionsGuard)
export class MovimentacaoController {
  constructor(private readonly repo: MovimentacaoRepository) {}

  @Get()
  @HttpCode(200)
  @RequirePermission('movimentacao', 'access')
  @ApiOperation({ summary: 'Listar movimentações com filtros e paginação' })
  @ApiQuery({ name: 'patrimonioId', required: false, type: Number })
  @ApiQuery({ name: 'tipo', required: false })
  @ApiQuery({ name: 'dataInicio', required: false })
  @ApiQuery({ name: 'dataFim', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('patrimonioId') patrimonioId?: number,
    @Query('tipo') tipo?: string,
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.repo.findAll({ patrimonioId, tipo, dataInicio, dataFim, page, limit });
  }

  @Post()
  @HttpCode(201)
  @RequirePermission('movimentacao', 'edit')
  @ApiOperation({ summary: 'Criar movimentação (preenche dados anteriores automaticamente)' })
  create(@Body() dto: CriarMovimentacaoDto, @CurrentUser() user: JwtPayload) {
    return this.repo.create(dto, user?.userId ? Number(user.userId) : undefined);
  }
}
