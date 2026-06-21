import type { lancamentos } from '@prisma/client'

export interface CreateLancamentoItem {
  data: string
  numeroDocumento?: string | null
  observacao?: string
  credito?: string | null
  debito?: string | null
}

export interface CreateLancamentoBulkData {
  contaCorrenteId: number
  clearExisting?: boolean
  lancamentos?: CreateLancamentoItem[]
  data?: string
  numeroDocumento?: string | null
  observacao?: string
  credito?: string | null
  debito?: string | null
}

export interface BulkCreateResult {
  count: number
  lancamentos: lancamentos[]
}

export interface RemoveByContaResult {
  deleted: number
  contaCorrenteId: number
}

export abstract class LancamentoRepository {
  abstract createBulk(data: CreateLancamentoBulkData): Promise<BulkCreateResult>
  abstract removeByContaCorrenteId(
    contaCorrenteId: number,
  ): Promise<RemoveByContaResult>
  abstract findContaByColaboradorId(
    colaboradorId: number,
  ): Promise<{ id: number } | null>
  abstract findLancamentoByIdAndConta(
    lancamentoId: number,
    contaCorrenteId: number,
  ): Promise<lancamentos | null>
  abstract removeLancamento(id: number): Promise<void>
}
