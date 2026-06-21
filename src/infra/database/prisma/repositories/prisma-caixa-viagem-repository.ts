import { Injectable } from '@nestjs/common'
import type {
  AtualizarCaixaViagemData,
  CaixaViagemRepository,
  CaixaViagemResumo,
  CaixaViagemStats,
  CaixaViagemTermo,
  CriarAdiantamentoData,
  CriarCaixaViagemData,
} from '../../../../domain/caixa-viagem/application/repositories/caixa-viagem-repository'
import { PrismaService } from '../../../../prisma/prisma.service'

const INCLUDE_COMPLETO = {
  empresa: { select: { id: true, nomeEmpresa: true } },
  funcionario: { select: { id: true, nome: true, sobrenome: true } },
  user: { select: { id: true, nome: true, sobrenome: true, email: true } },
  veiculo: { select: { id: true, nome: true } },
  lancamentos: { orderBy: { data: 'desc' as const } },
  adiantamentos: { orderBy: { data: 'desc' as const } },
} as const

@Injectable()
export class PrismaCaixaViagemRepository implements CaixaViagemRepository {
  constructor(private prisma: PrismaService) {}

  findAll(showHidden: boolean) {
    return this.prisma.caixaviagem.findMany({
      where: showHidden ? {} : { oculto: false },
      include: INCLUDE_COMPLETO,
      orderBy: { data: 'desc' },
    })
  }

  findByUserId(userId: string) {
    return this.prisma.caixaviagem.findMany({
      where: { userId, oculto: false },
      include: INCLUDE_COMPLETO,
      orderBy: { data: 'desc' },
    })
  }

  findById(id: number) {
    return this.prisma.caixaviagem.findUnique({
      where: { id },
      include: INCLUDE_COMPLETO,
    })
  }

  async findUltimoCaixaFuncionario(funcionarioId: number) {
    const results = await this.prisma.caixaviagem.findMany({
      where: { funcionarioId },
      include: INCLUDE_COMPLETO,
      orderBy: { data: 'desc' },
      take: 1,
    })
    return results[0] ?? null
  }

  create(data: CriarCaixaViagemData, userId: string) {
    return this.prisma.caixaviagem.create({
      data: {
        destino: data.destino,
        data: new Date(data.data),
        empresaId: data.empresaId ?? null,
        funcionarioId: data.funcionarioId ?? null,
        veiculoId: data.veiculoId ?? null,
        numeroCaixa: data.numeroCaixa ?? 1,
        observacao: data.observacao ?? null,
        saldoAnterior: data.saldoAnterior ?? 0,
        oculto: data.oculto ?? false,
        userId: data.userId ?? userId,
        updatedAt: new Date(),
      },
      include: INCLUDE_COMPLETO,
    })
  }

  update(id: number, data: AtualizarCaixaViagemData) {
    return this.prisma.caixaviagem.update({
      where: { id },
      data: {
        ...data,
        ...(data.data && { data: new Date(data.data) }),
        updatedAt: new Date(),
      },
      include: INCLUDE_COMPLETO,
    })
  }

  async excluir(id: number): Promise<void> {
    await this.prisma.viagemlancamento.deleteMany({
      where: { caixaViagemId: id },
    })
    await this.prisma.adiantamento.deleteMany({ where: { caixaViagemId: id } })
    await this.prisma.caixaviagem.delete({ where: { id } })
  }

  async toggleOculto(id: number) {
    const atual = await this.prisma.caixaviagem.findUniqueOrThrow({
      where: { id },
    })
    return this.prisma.caixaviagem.update({
      where: { id },
      data: { oculto: !atual.oculto, updatedAt: new Date() },
    })
  }

  async stats(): Promise<CaixaViagemStats> {
    const caixas = await this.prisma.caixaviagem.findMany({
      include: { lancamentos: true, adiantamentos: true },
    })

    let totalEntradas = 0
    let totalSaidas = 0
    let totalAdiantamentos = 0

    for (const caixa of caixas) {
      for (const l of caixa.lancamentos) {
        if (l.entrada) totalEntradas += Number.parseFloat(l.entrada)
        if (l.saida) totalSaidas += Number.parseFloat(l.saida)
      }
      for (const a of caixa.adiantamentos) {
        totalAdiantamentos += Number.parseFloat(a.saida)
      }
    }

    return {
      totalCaixas: caixas.length,
      totalEntradas,
      totalSaidas,
      saldo: totalEntradas - totalSaidas,
      totalAdiantamentos,
    }
  }

  async resumo(id: number): Promise<CaixaViagemResumo | null> {
    const caixa = await this.prisma.caixaviagem.findUnique({
      where: { id },
      include: { lancamentos: true, adiantamentos: true },
    })

    if (!caixa) return null

    let totalEntradas = Number.parseFloat(String(caixa.saldoAnterior ?? 0))
    let totalSaidas = 0

    for (const l of caixa.lancamentos) {
      if (l.entrada) totalEntradas += Number.parseFloat(l.entrada)
      if (l.saida) totalSaidas += Number.parseFloat(l.saida)
    }

    let totalAdiantamentos = 0
    for (const a of caixa.adiantamentos) {
      totalAdiantamentos += Number.parseFloat(a.saida)
    }

    return {
      id: caixa.id,
      destino: caixa.destino,
      data: caixa.data,
      saldoAnterior: Number.parseFloat(String(caixa.saldoAnterior ?? 0)),
      totalEntradas,
      totalSaidas,
      saldo: totalEntradas - totalSaidas,
      totalAdiantamentos,
      saldoFinal: totalEntradas - totalSaidas - totalAdiantamentos,
      quantidadeLancamentos: caixa.lancamentos.length,
      quantidadeAdiantamentos: caixa.adiantamentos.length,
    }
  }

  async gerarTermo(caixaViagemId: number): Promise<CaixaViagemTermo | null> {
    const caixa = await this.prisma.caixaviagem.findUnique({
      where: { id: caixaViagemId },
      include: INCLUDE_COMPLETO,
    })

    if (!caixa) return null

    let totalEntradas = Number.parseFloat(String(caixa.saldoAnterior ?? 0))
    let totalSaidas = 0

    for (const l of caixa.lancamentos) {
      if (l.entrada) totalEntradas += Number.parseFloat(l.entrada)
      if (l.saida) totalSaidas += Number.parseFloat(l.saida)
    }

    let totalAdiantamentos = 0
    for (const a of caixa.adiantamentos) {
      totalAdiantamentos += Number.parseFloat(a.saida)
    }

    return {
      titulo: 'Termo de Prestação de Contas - Caixa Viagem',
      dataGeracao: new Date().toISOString(),
      caixa,
      resumo: {
        saldoAnterior: Number.parseFloat(String(caixa.saldoAnterior ?? 0)),
        totalEntradas,
        totalSaidas,
        saldo: totalEntradas - totalSaidas,
        totalAdiantamentos,
        saldoFinal: totalEntradas - totalSaidas - totalAdiantamentos,
      },
    }
  }

  async recalcularSaldos(): Promise<void> {
    const caixas = await this.prisma.caixaviagem.findMany({
      include: { lancamentos: { orderBy: { data: 'asc' } } },
      orderBy: [{ funcionarioId: 'asc' }, { data: 'asc' }],
    })

    const porFuncionario: Record<number, typeof caixas> = {}
    for (const caixa of caixas) {
      const fId = caixa.funcionarioId ?? 0
      if (!porFuncionario[fId]) porFuncionario[fId] = []
      porFuncionario[fId].push(caixa)
    }

    for (const grupo of Object.values(porFuncionario)) {
      let saldoAnterior = 0
      for (const caixa of grupo) {
        await this.prisma.caixaviagem.update({
          where: { id: caixa.id },
          data: { saldoAnterior, updatedAt: new Date() },
        })

        let entradas = saldoAnterior
        let saidas = 0
        for (const l of caixa.lancamentos) {
          if (l.entrada) entradas += Number.parseFloat(l.entrada)
          if (l.saida) saidas += Number.parseFloat(l.saida)
        }
        saldoAnterior = entradas - saidas
      }
    }
  }

  findAdiantamentos(caixaViagemId?: number, colaboradorId?: number) {
    return this.prisma.adiantamento.findMany({
      where: {
        ...(caixaViagemId !== undefined && { caixaViagemId }),
        ...(colaboradorId !== undefined && { colaboradorId }),
        oculto: false,
      },
      include: {
        colaborador: { select: { id: true, nome: true, sobrenome: true } },
        caixaViagem: { select: { id: true, destino: true, data: true } },
      },
      orderBy: { data: 'desc' },
    })
  }

  findAdiantamentoById(id: number) {
    return this.prisma.adiantamento.findUnique({
      where: { id },
      include: {
        colaborador: { select: { id: true, nome: true, sobrenome: true } },
        caixaViagem: { select: { id: true, destino: true, data: true } },
      },
    })
  }

  criarAdiantamento(data: CriarAdiantamentoData) {
    return this.prisma.adiantamento.create({
      data: {
        data: new Date(data.data),
        saida: data.saida,
        observacao: data.observacao ?? null,
        nome: data.nome,
        caixaViagemId: data.caixaViagemId ?? null,
        colaboradorId: data.colaboradorId ?? null,
        userId: data.userId ?? null,
        oculto: data.oculto ?? false,
        updatedAt: new Date(),
      },
    })
  }

  atualizarAdiantamento(id: number, data: Partial<CriarAdiantamentoData>) {
    return this.prisma.adiantamento.update({
      where: { id },
      data: {
        ...data,
        ...(data.data && { data: new Date(data.data) }),
        updatedAt: new Date(),
      },
    })
  }

  async excluirAdiantamento(id: number): Promise<void> {
    await this.prisma.adiantamento.delete({ where: { id } })
  }
}
