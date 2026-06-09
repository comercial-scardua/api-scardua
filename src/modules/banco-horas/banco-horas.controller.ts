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
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RequirePermission } from '../../auth/decorators/require-permission.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import type { RegistrarPontoDto } from './dto/registrar-ponto.dto';
import { AtualizarRegistroUseCase } from './use-cases/atualizar-registro.use-case';
import { BuscarRegistroUseCase } from './use-cases/buscar-registro.use-case';
import { DeletarRegistroUseCase } from './use-cases/deletar-registro.use-case';
import { ListarRegistrosUseCase } from './use-cases/listar-registros.use-case';
import { ListarSaldosUseCase } from './use-cases/listar-saldos.use-case';
import { ObterSaldoHorasUseCase } from './use-cases/obter-saldo-horas.use-case';
import { RegistrarPontoUseCase } from './use-cases/registrar-ponto.use-case';
import { ColaboradorNaoEncontradoBancoHorasError } from './use-cases/errors/colaborador-nao-encontrado.error';

@ApiTags('Banco de Horas')
@ApiBearerAuth()
@Controller('banco-horas')
@UseGuards(PermissionsGuard)
export class BancoHorasController {
  constructor(
    private registrarPontoUseCase: RegistrarPontoUseCase,
    private listarRegistrosUseCase: ListarRegistrosUseCase,
    private buscarRegistroUseCase: BuscarRegistroUseCase,
    private atualizarRegistroUseCase: AtualizarRegistroUseCase,
    private deletarRegistroUseCase: DeletarRegistroUseCase,
    private obterSaldoUseCase: ObterSaldoHorasUseCase,
    private listarSaldosUseCase: ListarSaldosUseCase,
  ) {}

  @Post('registros')
  @HttpCode(201)
  @RequirePermission('banco-horas', 'edit')
  @ApiOperation({ summary: 'Registrar entrada/saída (folha de ponto)' })
  async registrarPonto(@Body() dto: RegistrarPontoDto) {
    const result = await this.registrarPontoUseCase.execute(dto);

    if (result.isLeft()) {
      const error = result.value;
      if (error instanceof ColaboradorNaoEncontradoBancoHorasError) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException((error as Error).message);
    }

    return (result.value as any).registro;
  }

  @Get('registros')
  @HttpCode(200)
  @RequirePermission('banco-horas', 'access')
  @ApiOperation({ summary: 'Listar registros de ponto por colaborador' })
  @ApiQuery({ name: 'colaboradorId', required: true, type: Number })
  @ApiQuery({ name: 'dataInicio', required: false, type: String })
  @ApiQuery({ name: 'dataFim', required: false, type: String })
  async listarPontos(
    @Query('colaboradorId', ParseIntPipe) colaboradorId: number,
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
  ) {
    return this.listarRegistrosUseCase.execute(
      colaboradorId,
      dataInicio ? new Date(dataInicio) : undefined,
      dataFim ? new Date(dataFim) : undefined,
    );
  }

  @Get('registros/:id')
  @HttpCode(200)
  @RequirePermission('banco-horas', 'access')
  @ApiOperation({ summary: 'Buscar registro de ponto por ID' })
  async buscarPonto(@Param('id', ParseIntPipe) id: number) {
    const result = await this.buscarRegistroUseCase.execute(id);

    if (result.isLeft()) {
      throw new NotFoundException((result.value as Error).message);
    }

    return (result.value as any).registro;
  }

  @Patch('registros/:id')
  @HttpCode(200)
  @RequirePermission('banco-horas', 'edit')
  @ApiOperation({ summary: 'Atualizar registro de ponto' })
  async atualizarPonto(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<RegistrarPontoDto>,
  ) {
    const result = await this.atualizarRegistroUseCase.execute(id, dto);

    if (result.isLeft()) {
      throw new NotFoundException((result.value as Error).message);
    }

    return (result.value as any).registro;
  }

  @Delete('registros/:id')
  @HttpCode(204)
  @RequirePermission('banco-horas', 'edit')
  @ApiOperation({ summary: 'Deletar registro de ponto' })
  async deletarPonto(@Param('id', ParseIntPipe) id: number) {
    const result = await this.deletarRegistroUseCase.execute(id);

    if (result.isLeft()) {
      throw new NotFoundException((result.value as Error).message);
    }
  }

  @Get('saldo/:colaboradorId')
  @HttpCode(200)
  @RequirePermission('banco-horas', 'access')
  @ApiOperation({ summary: 'Obter saldo de horas do colaborador' })
  async obterSaldoHoras(@Param('colaboradorId', ParseIntPipe) colaboradorId: number) {
    return this.obterSaldoUseCase.execute(colaboradorId);
  }

  @Get('saldos')
  @HttpCode(200)
  @RequirePermission('banco-horas', 'access')
  @ApiOperation({ summary: 'Listar saldos de horas de todos os colaboradores' })
  async listarSaldosHoras() {
    return this.listarSaldosUseCase.execute();
  }
}
