export interface CriarCaixaViagemData {
  destino: string
  data: string
  empresaId?: number | null
  funcionarioId?: number | null
  veiculoId?: number | null
  numeroCaixa?: number
  observacao?: string | null
  saldoAnterior?: number
  oculto?: boolean
  userId?: string | null
}

export interface AtualizarCaixaViagemData {
  destino?: string
  data?: string
  empresaId?: number | null
  funcionarioId?: number | null
  veiculoId?: number | null
  numeroCaixa?: number
  observacao?: string | null
  saldoAnterior?: number
  oculto?: boolean
  userId?: string | null
}

export interface CriarAdiantamentoData {
  data: string
  saida: string
  observacao?: string | null
  nome: string
  caixaViagemId?: number | null
  colaboradorId?: number | null
  userId?: string | null
  oculto?: boolean
}

type CaixaViagemCompleta = any
type AdiantamentoCompleto = any

export interface CaixaViagemStats {
  totalCaixas: number
  totalEntradas: number
  totalSaidas: number
  saldo: number
  totalAdiantamentos: number
}

export interface CaixaViagemResumo {
  id: number
  destino: string
  data: Date
  saldoAnterior: number
  totalEntradas: number
  totalSaidas: number
  saldo: number
  totalAdiantamentos: number
  saldoFinal: number
  quantidadeLancamentos: number
  quantidadeAdiantamentos: number
}

export interface CaixaViagemTermo {
  titulo: string
  dataGeracao: string
  caixa: CaixaViagemCompleta
  resumo: {
    saldoAnterior: number
    totalEntradas: number
    totalSaidas: number
    saldo: number
    totalAdiantamentos: number
    saldoFinal: number
  }
}

export abstract class CaixaViagemRepository {
  abstract findAll(showHidden: boolean): Promise<CaixaViagemCompleta[]>
  abstract findByUserId(userId: string): Promise<CaixaViagemCompleta[]>
  abstract findById(id: number): Promise<CaixaViagemCompleta | null>
  abstract findUltimoCaixaFuncionario(
    funcionarioId: number,
  ): Promise<CaixaViagemCompleta | null>
  abstract create(
    data: CriarCaixaViagemData,
    userId: string,
  ): Promise<CaixaViagemCompleta>
  abstract update(
    id: number,
    data: AtualizarCaixaViagemData,
  ): Promise<CaixaViagemCompleta>
  abstract excluir(id: number): Promise<void>
  abstract toggleOculto(id: number): Promise<CaixaViagemCompleta>
  abstract stats(): Promise<CaixaViagemStats>
  abstract resumo(id: number): Promise<CaixaViagemResumo | null>
  abstract gerarTermo(caixaViagemId: number): Promise<CaixaViagemTermo | null>
  abstract recalcularSaldos(): Promise<void>
  abstract findAdiantamentos(
    caixaViagemId?: number,
    colaboradorId?: number,
  ): Promise<AdiantamentoCompleto[]>
  abstract findAdiantamentoById(
    id: number,
  ): Promise<AdiantamentoCompleto | null>
  abstract criarAdiantamento(
    data: CriarAdiantamentoData,
  ): Promise<AdiantamentoCompleto>
  abstract atualizarAdiantamento(
    id: number,
    data: Partial<CriarAdiantamentoData>,
  ): Promise<AdiantamentoCompleto>
  abstract excluirAdiantamento(id: number): Promise<void>
}
