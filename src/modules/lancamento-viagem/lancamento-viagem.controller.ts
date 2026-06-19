import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../auth/guards/permissions.guard'
import type { LancamentoViagemBulkDto } from './dto/criar-lancamento-viagem.dto'
import { LancamentoViagemRepository } from './repositories/lancamento-viagem.repository'

@ApiTags('Lancamento Viagem')
@ApiBearerAuth()
@Controller('lancamentoviagem')
@UseGuards(PermissionsGuard)
export class LancamentoViagemController {
  constructor(private repo: LancamentoViagemRepository) {}

  @Get()
  @HttpCode(200)
  @RequirePermission('lancamentoviagem', 'access')
  @ApiOperation({ summary: 'Listar lançamentos de viagem' })
  @ApiQuery({ name: 'caixaViagemId', required: false, type: Number })
  @ApiQuery({ name: 'tipo', required: false })
  @ApiQuery({ name: 'userId', required: false })
  findAll(
    @Query('caixaViagemId') caixaViagemId?: string,
    @Query('tipo') tipo?: string,
    @Query('userId') userId?: string,
  ) {
    return this.repo.findAll({
      caixaId: caixaViagemId ? parseInt(caixaViagemId, 10) : undefined,
      tipo,
      userId,
    })
  }

  @Post()
  @HttpCode(201)
  @RequirePermission('lancamentoviagem', 'edit')
  @ApiOperation({
    summary:
      'Criar lançamento(s) de viagem — suporta formato bulk com lancamentos[]',
  })
  create(@Body() dto: LancamentoViagemBulkDto) {
    return this.repo.createBulk(dto)
  }

  @Get('usuario/:id')
  @HttpCode(200)
  @RequirePermission('lancamentoviagem', 'access')
  @ApiOperation({ summary: 'Listar lançamentos de viagem por colaboradorId' })
  findByColaborador(@Param('id', ParseIntPipe) id: number) {
    return this.repo.findByColaboradorId(id)
  }

  @Post('usuario/:id')
  @HttpCode(201)
  @RequirePermission('lancamentoviagem', 'edit')
  @ApiOperation({
    summary: 'Criar lançamento(s) de viagem para colaborador (caixa ativo)',
  })
  createForColaborador(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: LancamentoViagemBulkDto,
  ) {
    return this.repo.createBulkForColaborador(id, dto)
  }
}
