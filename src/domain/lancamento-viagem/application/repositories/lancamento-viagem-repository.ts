import type { viagemlancamento } from '@prisma/client'

export interface LancamentoViagemItem {
  data: string
  custo: string
  clienteFornecedor: string
  entrada?: string | null
  saida?: string | null
  numeroDocumento?: string | null
  historicoDoc?: string | null
}

export interface CreateLancamentoViagemBulkData {
  caixaViagemId?: number | null
  clearExisting?: boolean
  lancamentos?: LancamentoViagemItem[]
  data?: string
  custo?: string
  clienteFornecedor?: string
  entrada?: string | null
  saida?: string | null
  numeroDocumento?: string | null
  historicoDoc?: string | null
}

export interface BulkCreateViagemResult {
  count: number
  lancamentos: viagemlancamento[]
}

export interface FindAllViagemFilters {
  caixaId?: number
  tipo?: string
  userId?: string
}

export type LancamentoViagemComCaixa = viagemlancamento & {
  caixaViagem: {
    id: number
    destino: string
    data: Date
    funcionarioId: number | null
  } | null
}

export abstract class LancamentoViagemRepository {
  abstract findAll(
    filters: FindAllViagemFilters,
  ): Promise<LancamentoViagemComCaixa[]>
  abstract createBulk(
    data: CreateLancamentoViagemBulkData,
  ): Promise<BulkCreateViagemResult>
  abstract findByColaboradorId(
    colaboradorId: number,
  ): Promise<LancamentoViagemComCaixa[]>
  abstract findCaixaAtivaByColaboradorId(
    colaboradorId: number,
  ): Promise<{ id: number } | null>
}
