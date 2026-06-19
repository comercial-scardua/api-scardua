import type { patrimonios } from '@prisma/client'

export type PatrimonioCompleto = patrimonios & {
  responsavel: {
    id: number
    nome: string | null
    sobrenome: string | null
    cargo: string | null
    setor: string | null
  } | null
  movimentacoes: Array<{
    id: number
    tipo: string
    createdAt: Date
    autor: { id: number; nome: string | null; sobrenome: string | null } | null
    responsavelNovo: {
      id: number
      nome: string | null
      sobrenome: string | null
    } | null
    responsavelAnterior: {
      id: number
      nome: string | null
      sobrenome: string | null
    } | null
  }>
}

export interface CreatePatrimonioData {
  nome?: string
  descricao?: string
  data_aquisicao?: string
  valor?: string
  status?: string
  fabricante: string
  modelo?: string
  tipo: string
  localizacao: string
  responsavelId: number
  numeroNotaFiscal?: string
  dataNotaFiscal?: string
  dataGarantia?: string
  placa?: string
  renavan?: string
  anoModelo?: number
  kmEntrega?: string
  locado?: boolean
  franquia?: string
  proprietario?: string
  segurado?: boolean
  seguradora?: string
  dataVencimentoSeguro?: string
  numeroLinha?: string
  operadora?: string
  numeroSerie?: string
}

export type UpdatePatrimonioData = Partial<CreatePatrimonioData> & {
  oculto?: boolean
}

export interface CreateMovimentacaoData {
  patrimonioId: number
  tipo: string
  autorId?: number | null
  responsavelAnteriorId?: number | null
  responsavelNovoId?: number | null
  localizacaoAnterior?: string | null
  localizacaoNova?: string | null
  kmAnterior?: string | null
  kmNovo?: string | null
}

export interface PatrimonioStats {
  porTipo: Record<string, number>
  porSetor: Record<string, number>
  movimentacoesPorMes: Record<string, number>
}

export abstract class PatrimoniosRepository {
  abstract findAll(showHidden?: boolean): Promise<PatrimonioCompleto[]>
  abstract findById(id: number): Promise<PatrimonioCompleto | null>
  abstract findVeiculos(): Promise<
    { id: number; nome: string; modelo: string; placa: string }[]
  >
  abstract findBySerial(
    serial: string,
    skipId?: number,
  ): Promise<{ id: number; nome: string; tipo: string } | null>
  abstract stats(): Promise<PatrimonioStats>
  abstract create(data: CreatePatrimonioData): Promise<patrimonios>
  abstract update(id: number, data: UpdatePatrimonioData): Promise<patrimonios>
  abstract criarMovimentacao(data: CreateMovimentacaoData): Promise<void>
  abstract toggleOculto(id: number): Promise<patrimonios>
  /** Resolve o colaborador.id vinculado a um userId (autor de movimentações). */
  abstract findColaboradorIdByUserId(userId: string): Promise<number | null>
}
