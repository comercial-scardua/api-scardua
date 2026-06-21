import type { conta_corrente, lancamentos } from '@prisma/client'

export type ContaComLancamentos = conta_corrente & {
  lancamentos: lancamentos[]
  empresa: { id: number; nomeEmpresa: string } | null
  colaborador: {
    id: number
    nome: string | null
    sobrenome: string | null
  } | null
  user: { id: string; nome: string; sobrenome: string; email: string } | null
  saldo: number
}

export type ResumoContas = {
  totalEntradas: number
  totalSaidas: number
  balanco: number
  totalContas: number
  porTipo: {
    tipo: string
    count: number
    creditos: number
    debitos: number
    saldo: number
  }[]
  porSaldo: { positivo: number; negativo: number; total: number }
  topFornecedores: { nome: string; valor: number; count: number }[]
}

export type StatsContas = {
  totalContas: number
  totalContasVisiveis: number
  totalCreditos: number
  totalDebitos: number
  creditosMes: number
  debitosMes: number
  saldoGeral: number
  saldoMes: number
}

export interface CreateContaCorrenteData {
  data?: string
  tipo?: string
  fornecedorCliente?: string
  observacao?: string
  setor?: string
  empresaId?: number | null
  colaboradorId?: number | null
  oculto?: boolean
}

export interface CreateLancamentoData {
  data: string
  numeroDocumento?: string
  observacao?: string
  credito?: string
  debito?: string
}

export abstract class ContaCorrenteRepository {
  abstract findByUserId(userId: string): Promise<ContaComLancamentos[]>
  abstract findAll(showHidden?: boolean): Promise<ContaComLancamentos[]>
  abstract findById(id: number): Promise<ContaComLancamentos | null>
  abstract resumo(userId: string): Promise<ResumoContas>
  abstract create(
    data: CreateContaCorrenteData,
    userId: string,
  ): Promise<conta_corrente>
  abstract update(
    id: number,
    data: Partial<CreateContaCorrenteData>,
  ): Promise<conta_corrente>
  abstract excluir(id: number): Promise<void>
  abstract toggleOculto(id: number): Promise<conta_corrente>
  abstract criarLancamento(
    contaId: number,
    data: CreateLancamentoData,
  ): Promise<lancamentos>
  abstract atualizarLancamento(
    lancamentoId: number,
    data: Partial<CreateLancamentoData>,
  ): Promise<lancamentos>
  abstract excluirLancamento(lancamentoId: number): Promise<void>
  abstract stats(userId: string, showAll: boolean): Promise<StatsContas>
}
