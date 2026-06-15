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
  Response,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import type { Response as ExpressResponse } from 'express'
import { CurrentUser } from '../../auth/decorators/current-user.decorator'
import { RequirePermission } from '../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../auth/guards/permissions.guard'
import type { JwtPayload } from '../../auth/types/jwt-payload.type'
import { PrismaService } from '../../prisma/prisma.service'
import type { RegistrarPontoDto } from './dto/registrar-ponto.dto'
import { AtualizarRegistroUseCase } from './use-cases/atualizar-registro.use-case'
import { BuscarRegistroUseCase } from './use-cases/buscar-registro.use-case'
import { DeletarRegistroUseCase } from './use-cases/deletar-registro.use-case'
import { ColaboradorNaoEncontradoBancoHorasError } from './use-cases/errors/colaborador-nao-encontrado.error'
import { GerarRelatorioUseCase } from './use-cases/gerar-relatorio.use-case'
import { GerarTermoPdfUseCase } from './use-cases/gerar-termo-pdf.use-case'
import { ListarRegistrosUseCase } from './use-cases/listar-registros.use-case'
import { ListarSaldosUseCase } from './use-cases/listar-saldos.use-case'
import { ObterContaCorrenteUseCase } from './use-cases/obter-conta-corrente.use-case'
import { ObterEstatisticasUseCase } from './use-cases/obter-estatisticas.use-case'
import { ObterSaldoHorasUseCase } from './use-cases/obter-saldo-horas.use-case'
import { RegistrarPontoUseCase } from './use-cases/registrar-ponto.use-case'
import { CalculoHorasUtil } from './utils/calculo-horas.util'

@ApiTags('Banco de Horas')
@ApiBearerAuth()
@Controller('banco-de-horas')
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
    private obterEstatisticasUseCase: ObterEstatisticasUseCase,
    private gerarRelatorioUseCase: GerarRelatorioUseCase,
    private gerarTermoPdfUseCase: GerarTermoPdfUseCase,
    private obterContaCorrenteUseCase: ObterContaCorrenteUseCase,
    private prisma: PrismaService,
  ) {}

  // ── Registros ─────────────────────────────────────────────────────────────

  @Post('registros')
  @HttpCode(201)
  @RequirePermission('banco-horas', 'edit')
  @ApiOperation({ summary: 'Registrar entrada/saída (folha de ponto)' })
  async registrarPonto(@Body() dto: RegistrarPontoDto) {
    const result = await this.registrarPontoUseCase.execute(dto)

    if (result.isLeft()) {
      const error = result.value
      if (error instanceof ColaboradorNaoEncontradoBancoHorasError) {
        throw new NotFoundException(error.message)
      }
      throw new BadRequestException((error as Error).message)
    }

    return (result.value as any).registro
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
    )
  }

  @Get('registros/:id')
  @HttpCode(200)
  @RequirePermission('banco-horas', 'access')
  @ApiOperation({ summary: 'Buscar registro de ponto por ID' })
  async buscarPonto(@Param('id', ParseIntPipe) id: number) {
    const result = await this.buscarRegistroUseCase.execute(id)

    if (result.isLeft()) {
      throw new NotFoundException((result.value as Error).message)
    }

    return (result.value as any).registro
  }

  @Patch('registros/:id')
  @HttpCode(200)
  @RequirePermission('banco-horas', 'edit')
  @ApiOperation({ summary: 'Atualizar registro de ponto' })
  async atualizarPonto(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<RegistrarPontoDto>,
  ) {
    const result = await this.atualizarRegistroUseCase.execute(id, dto)

    if (result.isLeft()) {
      throw new NotFoundException((result.value as Error).message)
    }

    return (result.value as any).registro
  }

  @Delete('registros/:id')
  @HttpCode(204)
  @RequirePermission('banco-horas', 'edit')
  @ApiOperation({ summary: 'Deletar registro de ponto' })
  async deletarPonto(@Param('id', ParseIntPipe) id: number) {
    const result = await this.deletarRegistroUseCase.execute(id)

    if (result.isLeft()) {
      throw new NotFoundException((result.value as Error).message)
    }
  }

  // ── Saldos ────────────────────────────────────────────────────────────────

  @Get('saldo/:colaboradorId')
  @HttpCode(200)
  @RequirePermission('banco-horas', 'access')
  @ApiOperation({ summary: 'Obter saldo de horas do colaborador' })
  async obterSaldoHoras(
    @Param('colaboradorId', ParseIntPipe) colaboradorId: number,
  ) {
    return this.obterSaldoUseCase.execute(colaboradorId)
  }

  @Get('saldos')
  @HttpCode(200)
  @RequirePermission('banco-horas', 'access')
  @ApiOperation({ summary: 'Listar saldos de horas de todos os colaboradores' })
  async listarSaldosHoras() {
    return this.listarSaldosUseCase.execute()
  }

  // ── Estatísticas e relatórios ─────────────────────────────────────────────

  @Get('estatisticas')
  @HttpCode(200)
  @RequirePermission('banco-horas', 'access')
  @ApiOperation({ summary: 'Obter estatísticas de horas' })
  @ApiQuery({ name: 'dataInicio', required: false, type: String })
  @ApiQuery({ name: 'dataFim', required: false, type: String })
  @ApiQuery({ name: 'colaboradorId', required: false, type: Number })
  async obterEstatisticas(
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
    @Query('colaboradorId', new ParseIntPipe({ optional: true }))
    colaboradorId?: number,
  ): Promise<any> {
    return this.obterEstatisticasUseCase.execute(
      dataInicio ? new Date(dataInicio) : undefined,
      dataFim ? new Date(dataFim) : undefined,
      colaboradorId,
    )
  }

  @Get('relatorios')
  @HttpCode(200)
  @RequirePermission('banco-horas', 'access')
  @ApiOperation({ summary: 'Gerar relatório de horas em JSON' })
  @ApiQuery({ name: 'dataInicio', required: false, type: String })
  @ApiQuery({ name: 'dataFim', required: false, type: String })
  @ApiQuery({ name: 'colaboradorId', required: false, type: Number })
  async gerarRelatorio(
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
    @Query('colaboradorId', new ParseIntPipe({ optional: true }))
    colaboradorId?: number,
  ): Promise<any> {
    return this.gerarRelatorioUseCase.execute(
      dataInicio ? new Date(dataInicio) : undefined,
      dataFim ? new Date(dataFim) : undefined,
      colaboradorId,
    )
  }

  // ── Conta corrente ────────────────────────────────────────────────────────

  @Get('conta-corrente')
  @HttpCode(200)
  @RequirePermission('banco-horas', 'access')
  @ApiOperation({ summary: 'Obter conta corrente de horas' })
  @ApiQuery({ name: 'colaboradorId', required: false, type: Number })
  async obterContaCorrente(
    @Query('colaboradorId', new ParseIntPipe({ optional: true }))
    colaboradorId?: number,
  ) {
    if (colaboradorId) {
      return this.obterContaCorrenteUseCase.executePorColaborador(colaboradorId)
    }
    return this.obterContaCorrenteUseCase.executeTodas()
  }

  // ── Funcionários ──────────────────────────────────────────────────────────

  @Get('funcionarios')
  @HttpCode(200)
  @RequirePermission('banco-horas', 'access')
  @ApiOperation({
    summary: 'Listar funcionários com registros no banco de horas',
  })
  async listarFuncionarios() {
    const colaboradores = await this.prisma.colaboradores.findMany({
      where: { oculto: false },
      include: { contaCorrenteHoras: true },
      orderBy: { nome: 'asc' },
    })

    return colaboradores.map((c) => ({
      id: c.id,
      nome: `${c.nome} ${c.sobrenome}`.trim(),
      cpf: c.cpf,
      cargo: c.cargo,
      email: c.email,
      saldo: c.contaCorrenteHoras ? Number(c.contaCorrenteHoras.saldo) : 0,
    }))
  }

  @Get('usuario/horas')
  @HttpCode(200)
  @RequirePermission('banco-horas', 'access')
  @ApiOperation({ summary: 'Obter horas do usuário logado' })
  async obterHorasUsuario(@CurrentUser() user: JwtPayload) {
    const colaborador = await this.prisma.colaboradores.findFirst({
      where: { userId: user.userId, oculto: false },
    })

    if (!colaborador) {
      throw new NotFoundException(
        'Colaborador não encontrado para o usuário logado',
      )
    }

    const [registros, conta] = await Promise.all([
      this.prisma.registros_banco_horas.findMany({
        where: { colaborador_id: colaborador.id },
        orderBy: { data: 'desc' },
        take: 30,
      }),
      this.prisma.conta_corrente_horas.findUnique({
        where: { colaborador_id: colaborador.id },
      }),
    ])

    return { colaborador, registros, conta }
  }

  // ── Geração de termos ─────────────────────────────────────────────────────

  @Post('gerar-termo')
  @HttpCode(200)
  @RequirePermission('banco-horas', 'access')
  @ApiOperation({ summary: 'Gerar termo de banco de horas em JSON' })
  async gerarTermo(
    @Body() body: {
      colaboradorId: number
      dataInicio?: string
      dataFim?: string
    },
  ) {
    const { colaboradorId, dataInicio, dataFim } = body

    if (!colaboradorId)
      throw new BadRequestException('colaboradorId é obrigatório')

    const colaborador = await this.prisma.colaboradores.findUnique({
      where: { id: colaboradorId },
    })

    if (!colaborador)
      throw new NotFoundException(
        `Colaborador #${colaboradorId} não encontrado`,
      )

    const where: any = { colaborador_id: colaboradorId }
    if (dataInicio || dataFim) {
      where.data = {}
      if (dataInicio) where.data.gte = new Date(dataInicio)
      if (dataFim) where.data.lte = new Date(dataFim)
    }

    const [registros, conta] = await Promise.all([
      this.prisma.registros_banco_horas.findMany({
        where,
        orderBy: { data: 'asc' },
      }),
      this.prisma.conta_corrente_horas.findUnique({
        where: { colaborador_id: colaboradorId },
      }),
    ])

    const registrosFormatados = registros.map((reg) => {
      const horas = CalculoHorasUtil.calcularHorasDoRegistro(
        reg.hora_inicio,
        reg.hora_fim,
        reg.intervalo_minutos,
        reg.horas_corrigidas ? Number(reg.horas_corrigidas) : undefined,
      )
      return {
        id: reg.id,
        data: reg.data.toISOString().split('T')[0],
        tipo: reg.tipo,
        horaInicio: reg.hora_inicio,
        horaFim: reg.hora_fim,
        horas: CalculoHorasUtil.formatarHorasDecimal(horas),
        observacao: reg.observacao,
      }
    })

    return {
      titulo: 'Termo de Banco de Horas',
      dataGeracao: new Date().toISOString(),
      colaborador: {
        id: colaborador.id,
        nome: `${colaborador.nome} ${colaborador.sobrenome}`.trim(),
        cpf: colaborador.cpf,
        cargo: colaborador.cargo,
      },
      periodo: {
        inicio: dataInicio ?? 'sem-filtro',
        fim: dataFim ?? 'sem-filtro',
      },
      saldo: conta
        ? {
            totalPositivo: CalculoHorasUtil.formatarHorasDecimal(
              Number((conta as any).total_positivo),
            ),
            totalNegativo: CalculoHorasUtil.formatarHorasDecimal(
              Number((conta as any).total_negativo),
            ),
            saldo: CalculoHorasUtil.formatarHorasDecimal(
              Number((conta as any).saldo),
            ),
          }
        : null,
      registros: registrosFormatados,
    }
  }

  @Post('gerar-termo-pdf')
  @HttpCode(200)
  @RequirePermission('banco-horas', 'access')
  @ApiOperation({ summary: 'Gerar termo de banco de horas em PDF (via body)' })
  async gerarTermoPdfPost(
    @Body() body: {
      colaboradorId: number
      dataInicio?: string
      dataFim?: string
    },
    @Response() res: ExpressResponse,
  ) {
    const { colaboradorId, dataInicio, dataFim } = body

    if (!colaboradorId)
      throw new BadRequestException('colaboradorId é obrigatório')

    try {
      const pdfStream = await this.gerarTermoPdfUseCase.execute(
        colaboradorId,
        dataInicio ? new Date(dataInicio) : undefined,
        dataFim ? new Date(dataFim) : undefined,
      )

      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="termo-banco-horas-${colaboradorId}.pdf"`,
      )

      pdfStream.pipe(res)
    } catch (error) {
      res.status(404).json({ error: (error as Error).message })
    }
  }

  @Get('termo/:colaboradorId/pdf')
  @HttpCode(200)
  @RequirePermission('banco-horas', 'access')
  @ApiOperation({ summary: 'Gerar termo de banco de horas em PDF (via query)' })
  @ApiQuery({ name: 'dataInicio', required: false, type: String })
  @ApiQuery({ name: 'dataFim', required: false, type: String })
  async gerarTermoPdf(
    @Param('colaboradorId', ParseIntPipe) colaboradorId: number,
    @Response() res: ExpressResponse,
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
  ) {
    try {
      const pdfStream = await this.gerarTermoPdfUseCase.execute(
        colaboradorId,
        dataInicio ? new Date(dataInicio) : undefined,
        dataFim ? new Date(dataFim) : undefined,
      )

      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="termo-banco-horas-${colaboradorId}.pdf"`,
      )

      pdfStream.pipe(res)
    } catch (error) {
      res.status(404).json({ error: (error as Error).message })
    }
  }

  @Post('gerar-termo-ausencia')
  @HttpCode(200)
  @RequirePermission('banco-horas', 'access')
  @ApiOperation({ summary: 'Gerar termo de ausência em JSON' })
  async gerarTermoAusencia(
    @Body()
    body: {
      colaboradorId: number
      dataInicio: string
      dataFim: string
      motivo?: string
    },
  ) {
    const { colaboradorId, dataInicio, dataFim, motivo } = body

    if (!colaboradorId || !dataInicio || !dataFim) {
      throw new BadRequestException(
        'colaboradorId, dataInicio e dataFim são obrigatórios',
      )
    }

    const colaborador = await this.prisma.colaboradores.findUnique({
      where: { id: colaboradorId },
    })

    if (!colaborador)
      throw new NotFoundException(
        `Colaborador #${colaboradorId} não encontrado`,
      )

    const registrosAusencia = await this.prisma.registros_banco_horas.findMany({
      where: {
        colaborador_id: colaboradorId,
        tipo: { in: ['SAIDA', 'AUSENCIA', 'FALTA'] },
        data: { gte: new Date(dataInicio), lte: new Date(dataFim) },
      },
      orderBy: { data: 'asc' },
    })

    const totalHorasAusencia = registrosAusencia.reduce((acc, reg) => {
      return (
        acc +
        CalculoHorasUtil.calcularHorasDoRegistro(
          reg.hora_inicio,
          reg.hora_fim,
          reg.intervalo_minutos,
          reg.horas_corrigidas ? Number(reg.horas_corrigidas) : undefined,
        )
      )
    }, 0)

    return {
      titulo: 'Termo de Ausência',
      dataGeracao: new Date().toISOString(),
      colaborador: {
        id: colaborador.id,
        nome: `${colaborador.nome} ${colaborador.sobrenome}`.trim(),
        cpf: colaborador.cpf,
        cargo: colaborador.cargo,
      },
      periodo: { inicio: dataInicio, fim: dataFim },
      motivo: motivo ?? '',
      totalAusencias: registrosAusencia.length,
      totalHorasAusencia:
        CalculoHorasUtil.formatarHorasDecimal(totalHorasAusencia),
      registros: registrosAusencia.map((reg) => ({
        id: reg.id,
        data: reg.data.toISOString().split('T')[0],
        tipo: reg.tipo,
        horas: CalculoHorasUtil.formatarHorasDecimal(
          CalculoHorasUtil.calcularHorasDoRegistro(
            reg.hora_inicio,
            reg.hora_fim,
            reg.intervalo_minutos,
            reg.horas_corrigidas ? Number(reg.horas_corrigidas) : undefined,
          ),
        ),
        observacao: reg.observacao,
      })),
    }
  }

  @Post('gerar-termo-ausencia-pdf')
  @HttpCode(200)
  @RequirePermission('banco-horas', 'access')
  @ApiOperation({ summary: 'Gerar termo de ausência em PDF' })
  async gerarTermoAusenciaPdf(
    @Body()
    body: {
      colaboradorId: number
      dataInicio: string
      dataFim: string
      motivo?: string
    },
    @Response() res: ExpressResponse,
  ) {
    const { colaboradorId, dataInicio, dataFim } = body

    if (!colaboradorId || !dataInicio || !dataFim) {
      throw new BadRequestException(
        'colaboradorId, dataInicio e dataFim são obrigatórios',
      )
    }

    const colaborador = await this.prisma.colaboradores.findUnique({
      where: { id: colaboradorId },
    })

    if (!colaborador) {
      res
        .status(404)
        .json({ error: `Colaborador #${colaboradorId} não encontrado` })
      return
    }

    // Reutiliza o PDF de termo filtrado por ausências no período
    try {
      const pdfStream = await this.gerarTermoPdfUseCase.execute(
        colaboradorId,
        new Date(dataInicio),
        new Date(dataFim),
      )

      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="termo-ausencia-${colaboradorId}.pdf"`,
      )

      pdfStream.pipe(res)
    } catch (error) {
      res.status(500).json({ error: (error as Error).message })
    }
  }

  @Post('gerar-termos-registros')
  @HttpCode(200)
  @RequirePermission('banco-horas', 'access')
  @ApiOperation({ summary: 'Gerar termos para múltiplos registros' })
  async gerarTermosRegistros(@Body() body: { registroIds: number[] }) {
    const { registroIds } = body

    if (!registroIds?.length)
      throw new BadRequestException(
        'registroIds é obrigatório e não pode estar vazio',
      )

    const registros = await this.prisma.registros_banco_horas.findMany({
      where: { id: { in: registroIds } },
      orderBy: [{ colaborador_id: 'asc' }, { data: 'asc' }],
    })

    if (!registros.length)
      throw new NotFoundException('Nenhum registro encontrado')

    const colaboradorIds = [...new Set(registros.map((r) => r.colaborador_id))]
    const colaboradores = await this.prisma.colaboradores.findMany({
      where: { id: { in: colaboradorIds } },
    })

    const colaboradoresMap = new Map(colaboradores.map((c) => [c.id, c]))

    const termos = colaboradorIds.map((colabId) => {
      const colab = colaboradoresMap.get(colabId)!
      const regsColab = registros.filter((r) => r.colaborador_id === colabId)

      return {
        colaborador: {
          id: colab.id,
          nome: `${colab.nome} ${colab.sobrenome}`.trim(),
          cpf: colab.cpf,
          cargo: colab.cargo,
        },
        registros: regsColab.map((reg) => ({
          id: reg.id,
          data: reg.data.toISOString().split('T')[0],
          tipo: reg.tipo,
          horas: CalculoHorasUtil.formatarHorasDecimal(
            CalculoHorasUtil.calcularHorasDoRegistro(
              reg.hora_inicio,
              reg.hora_fim,
              reg.intervalo_minutos,
              reg.horas_corrigidas ? Number(reg.horas_corrigidas) : undefined,
            ),
          ),
          observacao: reg.observacao,
        })),
      }
    })

    return {
      dataGeracao: new Date().toISOString(),
      totalTermos: termos.length,
      termos,
    }
  }

  @Post('baixar-termo')
  @HttpCode(200)
  @RequirePermission('banco-horas', 'access')
  @ApiOperation({ summary: 'Download de termo de banco de horas em PDF' })
  async baixarTermo(
    @Body() body: {
      colaboradorId: number
      dataInicio?: string
      dataFim?: string
    },
    @Response() res: ExpressResponse,
  ) {
    const { colaboradorId, dataInicio, dataFim } = body

    if (!colaboradorId)
      throw new BadRequestException('colaboradorId é obrigatório')

    try {
      const pdfStream = await this.gerarTermoPdfUseCase.execute(
        colaboradorId,
        dataInicio ? new Date(dataInicio) : undefined,
        dataFim ? new Date(dataFim) : undefined,
      )

      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="termo-banco-horas-${colaboradorId}.pdf"`,
      )

      pdfStream.pipe(res)
    } catch (error) {
      res.status(404).json({ error: (error as Error).message })
    }
  }

  // ── Sincronização ─────────────────────────────────────────────────────────

  @Get('sincronizar')
  @HttpCode(200)
  @RequirePermission('banco-horas', 'access')
  @ApiOperation({
    summary: 'Status da sincronização de conta corrente de horas',
  })
  async statusSincronizacao() {
    const [totalRegistros, totalContas, totalColaboradores] = await Promise.all(
      [
        this.prisma.registros_banco_horas.count(),
        this.prisma.conta_corrente_horas.count(),
        this.prisma.colaboradores.count({ where: { oculto: false }}),
      ],
    )

    return {
      totalRegistros,
      totalContas,
      totalColaboradoresAtivos: totalColaboradores,
      contasSemSincronizar: totalColaboradores - totalContas,
      ultimaVerificacao: new Date().toISOString(),
    }
  }

  @Post('sincronizar')
  @HttpCode(200)
  @RequirePermission('banco-horas', 'edit')
  @ApiOperation({
    summary:
      'Sincronizar/recalcular conta corrente de horas de todos os colaboradores',
  })
  async sincronizar() {
    const colaboradores = await this.prisma.colaboradores.findMany({
      where: { oculto: false },
      include: { registrosBancoHoras: true },
    })

    let sincronizados = 0
    const erros: string[] = []

    for (const colaborador of colaboradores) {
      try {
        let totalPositivo = 0
        let totalNegativo = 0

        for (const reg of colaborador.registrosBancoHoras) {
          const horas = CalculoHorasUtil.calcularHorasDoRegistro(
            reg.hora_inicio,
            reg.hora_fim,
            reg.intervalo_minutos,
            reg.horas_corrigidas ? Number(reg.horas_corrigidas) : undefined,
          )

          if (reg.tipo === 'ENTRADA' || reg.tipo === 'TRABALHO') {
            totalPositivo += horas
          } else if (
            ['SAIDA', 'AUSENCIA', 'FALTA', 'PAGAMENTO'].includes(reg.tipo)
          ) {
            totalNegativo += Math.abs(horas)
          }
        }

        const saldo = totalPositivo - totalNegativo
        const nome = `${colaborador.nome} ${colaborador.sobrenome}`.trim()

        await this.prisma.conta_corrente_horas.upsert({
          where: { colaborador_id: colaborador.id },
          create: {
            colaborador_id: colaborador.id,
            funcionario_nome: nome,
            total_positivo: totalPositivo,
            total_negativo: totalNegativo,
            saldo,
          },
          update: {
            funcionario_nome: nome,
            total_positivo: totalPositivo,
            total_negativo: totalNegativo,
            saldo,
          },
        })

        sincronizados++
      } catch (e) {
        erros.push(`Colaborador #${colaborador.id}: ${(e as Error).message}`)
      }
    }

    return {
      sincronizados,
      total: colaboradores.length,
      erros,
      finalizadoEm: new Date().toISOString(),
    }
  }

  // ── Exportação ────────────────────────────────────────────────────────────

  @Get('exportar')
  @HttpCode(200)
  @RequirePermission('banco-horas', 'access')
  @ApiOperation({
    summary: 'Exportar todos os registros de banco de horas em JSON',
  })
  @ApiQuery({ name: 'colaboradorId', required: false, type: Number })
  @ApiQuery({ name: 'dataInicio', required: false, type: String })
  @ApiQuery({ name: 'dataFim', required: false, type: String })
  async exportar(
    @Query('colaboradorId', new ParseIntPipe({ optional: true }))
    colaboradorId?: number,
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
  ) {
    const where: any = {}

    if (colaboradorId) where.colaborador_id = colaboradorId
    if (dataInicio || dataFim) {
      where.data = {}
      if (dataInicio) where.data.gte = new Date(dataInicio)
      if (dataFim) where.data.lte = new Date(dataFim)
    }

    const registros = await this.prisma.registros_banco_horas.findMany({
      where,
      orderBy: [{ colaborador_id: 'asc' }, { data: 'desc' }],
    })

    return {
      exportadoEm: new Date().toISOString(),
      total: registros.length,
      registros: registros.map((reg) => ({
        id: reg.id,
        colaboradorId: reg.colaborador_id,
        funcionarioNome: reg.funcionario_nome,
        tipo: reg.tipo,
        data: reg.data.toISOString().split('T')[0],
        horaInicio: reg.hora_inicio,
        horaFim: reg.hora_fim,
        intervaloMinutos: reg.intervalo_minutos,
        horasCorrigidas: reg.horas_corrigidas,
        horas: CalculoHorasUtil.formatarHorasDecimal(
          CalculoHorasUtil.calcularHorasDoRegistro(
            reg.hora_inicio,
            reg.hora_fim,
            reg.intervalo_minutos,
            reg.horas_corrigidas ? Number(reg.horas_corrigidas) : undefined,
          ),
        ),
        observacao: reg.observacao,
        dataCriacao: reg.data_criacao,
      })),
    }
  }

  @Post('exportar-relatorio')
  @HttpCode(200)
  @RequirePermission('banco-horas', 'access')
  @ApiOperation({ summary: 'Exportar relatório de horas com filtros via body' })
  async exportarRelatorio(
    @Body()
    body: { colaboradorId?: number; dataInicio?: string; dataFim?: string },
  ): Promise<any> {
    return this.gerarRelatorioUseCase.execute(
      body.dataInicio ? new Date(body.dataInicio) : undefined,
      body.dataFim ? new Date(body.dataFim) : undefined,
      body.colaboradorId,
    )
  }

  // ── Debug ─────────────────────────────────────────────────────────────────

  @Get('debug')
  @HttpCode(200)
  @RequirePermission('banco-horas', 'access')
  @ApiOperation({ summary: 'Diagnóstico do banco de horas' })
  async debug() {
    const [registros, contas, colaboradores] = await Promise.all([
      this.prisma.registros_banco_horas.count(),
      this.prisma.conta_corrente_horas.count(),
      this.prisma.colaboradores.count({ where: { oculto: false }}),
    ])

    const registrosSemHoras = await this.prisma.registros_banco_horas.count({
      where: { hora_inicio: null, hora_fim: null, horas_corrigidas: null },
    })

    const tiposContagem = await this.prisma.registros_banco_horas.groupBy({
      by: ['tipo'],
      _count: { id: true },
    })

    return {
      diagnostico: {
        totalRegistros: registros,
        totalContasCorrentes: contas,
        totalColaboradoresAtivos: colaboradores,
        registrosSemHoras,
        tiposPorContagem: tiposContagem.map((t) => ({
          tipo: t.tipo,
          total: t._count.id,
        })),
      },
      status: 'ok',
      timestamp: new Date().toISOString(),
    }
  }
}
