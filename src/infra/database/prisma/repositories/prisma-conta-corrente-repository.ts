import { Injectable } from '@nestjs/common'
import type {
  ContaComLancamentos,
  ContaCorrenteRepository,
  CreateContaCorrenteData,
  CreateLancamentoData,
  StatsContas,
} from '../../../../domain/conta-corrente/application/repositories/conta-corrente-repository'
import { PrismaService } from '../../../../prisma/prisma.service'

const INCLUDE_COMPLETO = {
  empresa: { select: { id: true, nomeEmpresa: true } },
  colaborador: { select: { id: true, nome: true, sobrenome: true } },
  user: { select: { id: true, nome: true, sobrenome: true, email: true } },
  lancamentos: { orderBy: { data: 'desc' as const } },
} as const

function calcularSaldo(
  lancamentos: { credito: string | null; debito: string | null }[],
): number {
  return lancamentos.reduce((acc, l) => {
    if (l.credito) acc += Number.parseFloat(l.credito)
    if (l.debito) acc -= Number.parseFloat(l.debito)
    return acc
  }, 0)
}

function comSaldo(contas: any[]): ContaComLancamentos[] {
  return contas.map((c) => ({ ...c, saldo: calcularSaldo(c.lancamentos) }))
}

@Injectable()
export class PrismaContaCorrenteRepository implements ContaCorrenteRepository {
  constructor(private prisma: PrismaService) {}

  async findByUserId(userId: string) {
    const contas = await this.prisma.conta_corrente.findMany({
      where: { userId, oculto: false },
      include: INCLUDE_COMPLETO,
      orderBy: { createdAt: 'desc' },
    })
    return comSaldo(contas)
  }

  async findAll(showHidden = false) {
    const contas = await this.prisma.conta_corrente.findMany({
      where: showHidden ? {} : { oculto: false },
      include: INCLUDE_COMPLETO,
      orderBy: { updatedAt: 'desc' },
    })
    return comSaldo(contas)
  }

  async findById(id: number) {
    const conta = await this.prisma.conta_corrente.findUnique({
      where: { id },
      include: INCLUDE_COMPLETO,
    })
    if (!conta) return null
    return {
      ...conta,
      saldo: calcularSaldo(conta.lancamentos),
    } as ContaComLancamentos
  }

  async resumo(userId: string) {
    const contas = await this.prisma.conta_corrente.findMany({
      where: { userId, oculto: false },
      include: { lancamentos: true },
    })

    let totalEntradas = 0
    let totalSaidas = 0
    const porTipoMap: Record<
      string,
      { count: number; creditos: number; debitos: number }
    > = {}
    const fornecedoresMap: Record<string, { valor: number; count: number }> = {}
    let contasPositivas = 0
    let contasNegativas = 0

    for (const conta of contas) {
      const saldoConta = calcularSaldo(conta.lancamentos)
      if (saldoConta > 0) contasPositivas++
      if (saldoConta < 0) contasNegativas++

      const tipoData = porTipoMap[conta.tipo] ?? {
        count: 0,
        creditos: 0,
        debitos: 0,
      }
      tipoData.count++

      for (const l of conta.lancamentos) {
        const credito = l.credito ? Number.parseFloat(l.credito) : 0
        const debito = l.debito ? Number.parseFloat(l.debito) : 0
        totalEntradas += credito
        totalSaidas += debito
        tipoData.creditos += credito
        tipoData.debitos += debito
      }

      porTipoMap[conta.tipo] = tipoData

      const nome = conta.fornecedorCliente || 'Sem identificação'
      const forn = fornecedoresMap[nome] ?? { valor: 0, count: 0 }
      forn.valor += Math.abs(saldoConta)
      forn.count++
      fornecedoresMap[nome] = forn
    }

    return {
      totalEntradas,
      totalSaidas,
      balanco: totalEntradas - totalSaidas,
      totalContas: contas.length,
      porTipo: Object.entries(porTipoMap).map(([tipo, d]) => ({
        tipo,
        count: d.count,
        creditos: d.creditos,
        debitos: d.debitos,
        saldo: d.creditos - d.debitos,
      })),
      porSaldo: {
        positivo: contasPositivas,
        negativo: contasNegativas,
        total: contas.length,
      },
      topFornecedores: Object.entries(fornecedoresMap)
        .map(([nome, d]) => ({ nome, valor: d.valor, count: d.count }))
        .sort((a, b) => b.valor - a.valor)
        .slice(0, 5),
    }
  }

  create(data: CreateContaCorrenteData, userId: string) {
    return this.prisma.conta_corrente.create({
      data: {
        tipo: data.tipo ?? 'EXTRA_CAIXA',
        fornecedorCliente: data.fornecedorCliente ?? '',
        observacao: data.observacao ?? '',
        setor: data.setor ?? '',
        empresaId: data.empresaId ?? null,
        colaboradorId: data.colaboradorId ?? null,
        oculto: data.oculto ?? false,
        userId,
        data: data.data ? new Date(data.data) : new Date(),
        updatedAt: new Date(),
      },
    })
  }

  update(id: number, data: Partial<CreateContaCorrenteData>) {
    return this.prisma.conta_corrente.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
    })
  }

  async excluir(id: number): Promise<void> {
    await this.prisma.lancamentos.deleteMany({ where: { contaCorrenteId: id } })
    await this.prisma.conta_corrente.delete({ where: { id } })
  }

  async toggleOculto(id: number) {
    const atual = await this.prisma.conta_corrente.findUniqueOrThrow({
      where: { id },
    })
    return this.prisma.conta_corrente.update({
      where: { id },
      data: { oculto: !atual.oculto, updatedAt: new Date() },
    })
  }

  criarLancamento(contaId: number, data: CreateLancamentoData) {
    return this.prisma.lancamentos.create({
      data: {
        contaCorrenteId: contaId,
        data: new Date(data.data),
        observacao: data.observacao ?? '',
        numeroDocumento: data.numeroDocumento,
        credito: data.credito,
        debito: data.debito,
        updatedAt: new Date(),
      },
    })
  }

  atualizarLancamento(
    lancamentoId: number,
    data: Partial<CreateLancamentoData>,
  ) {
    return this.prisma.lancamentos.update({
      where: { id: lancamentoId },
      data: {
        ...data,
        ...(data.data && { data: new Date(data.data) }),
        updatedAt: new Date(),
      },
    })
  }

  async excluirLancamento(lancamentoId: number): Promise<void> {
    await this.prisma.lancamentos.delete({ where: { id: lancamentoId } })
  }

  async stats(userId: string, showAll: boolean): Promise<StatsContas> {
    const contas = await this.prisma.conta_corrente.findMany({
      where: showAll ? {} : { userId },
      include: { lancamentos: true },
    })

    const visiveis = contas.filter((c) => !c.oculto)
    const inicioMes = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1,
    )

    let totalCreditos = 0
    let totalDebitos = 0
    let creditosMes = 0
    let debitosMes = 0

    for (const conta of visiveis) {
      for (const l of conta.lancamentos) {
        const c = l.credito ? Number.parseFloat(l.credito) : 0
        const d = l.debito ? Number.parseFloat(l.debito) : 0
        totalCreditos += c
        totalDebitos += d
        if (new Date(l.data) >= inicioMes) {
          creditosMes += c
          debitosMes += d
        }
      }
    }

    return {
      totalContas: contas.length,
      totalContasVisiveis: visiveis.length,
      totalCreditos,
      totalDebitos,
      creditosMes,
      debitosMes,
      saldoGeral: totalCreditos - totalDebitos,
      saldoMes: creditosMes - debitosMes,
    }
  }
}
