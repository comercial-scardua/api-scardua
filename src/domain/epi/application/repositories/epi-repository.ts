import type {
  epi_cargo_obrigatorio,
  epi_cargos,
  epi_estoque_movimentacoes,
  epi_movimentacoes,
  epi_transferencias,
  epis,
} from '@prisma/client'

export type GestorPerfil = {
  isAdmin: boolean
  isGestor: boolean
  colaboradorId: number | null
  empresaIds: number[]
  empresasGestor: { id: number; nomeEmpresa: string }[]
}

export type EpiDetalhe = epis & {
  movimentacoes: (epi_movimentacoes & {
    colaborador: { nome: string | null; sobrenome: string | null }
  })[]
  estoque_movimentacoes: epi_estoque_movimentacoes[]
  cargos_obrigatorios: (epi_cargo_obrigatorio & { cargo: epi_cargos })[]
}

export type EpiComSituacao = epis & {
  situacao: 'ok' | 'baixo' | 'zerado'
}

export type CargoComCount = epi_cargos & {
  _count: { colaboradores: number; epis_obrigatorios: number }
}

export type CargoEpiLink = epi_cargo_obrigatorio & {
  epi: Pick<
    epis,
    'id' | 'nome' | 'ca' | 'categoria' | 'estoque_atual' | 'status'
  >
}

export type ColaboradorEpi = {
  id: number
  nome: string
  matricula: string | null
  cargo_id: number | null
  cargo: string | null
  setor: string | null
  unidade: string | null
  data_admissao: string | null
  status: 'ativo' | 'inativo'
  gestor: string | null
  gestorId: number | null
  observacoes: string | null
  isGestor: boolean
  empresaId: number | null
  empresaNome: string | null
  empresaCnpj: string | null
}

export type MovimentacaoEpiDetalhe = epi_movimentacoes & {
  epi: Pick<epis, 'id' | 'nome' | 'codigo' | 'ca' | 'categoria'>
  colaborador: { id: number; nome: string | null; sobrenome: string | null }
}

export type EstoqueResumo = {
  epis: EpiComSituacao[]
  movimentacoes: (epi_estoque_movimentacoes & { epi: Pick<epis, 'nome'> })[]
}

export type SaldoFiliaisResult = {
  produtos: {
    id: number
    codigoInterno: string
    nome: string
    categoria: string
    unidade: string
    estoqueMinimo: number
    estoqueAtual: number
  }[]
  empresas: {
    id: number
    nomeEmpresa: string
    numero: string | null
    cidade: string | null
  }[]
  saldos: Record<number, Record<number, number>>
}

export type DashboardData = {
  totalColaboradores: number
  totalEpis: number
  alertasVencidos: number
  alertasProximos: number
  estoqueBaixo: number
  entregasMes: number
  ultimasMovimentacoes: MovimentacaoEpiDetalhe[]
}

export type AlertasData = {
  vencidos: MovimentacaoEpiDetalhe[]
  proximos: MovimentacaoEpiDetalhe[]
  estoqueBaixo: EpiComSituacao[]
  total: number
}

export type TransferenciaComDetalhes = epi_transferencias & {
  produtoId: number
  produto: { nome: string; codigo: string; categoria: string } | null
  empresaOrigem: { nomeEmpresa: string } | null
  empresaDestino: { nomeEmpresa: string } | null
}

// Inline data interfaces (replace DTOs)

export interface CriarEpiData {
  nome: string
  codigo: string
  ca: string
  categoria: string
  tamanho?: string
  fabricante: string
  vida_util_dias: number
  estoque_inicial?: number
  estoque_minimo?: number
  observacoes?: string
}

export interface AtualizarEpiData {
  nome?: string
  ca?: string
  categoria?: string
  tamanho?: string
  fabricante?: string
  vida_util_dias?: number
  estoque_minimo?: number
  status?: 'ATIVO' | 'INATIVO'
  observacoes?: string
}

export interface CriarCargoEpiData {
  nome: string
  descricao?: string
}

export interface AtualizarCargoEpiData {
  nome?: string
  descricao?: string
}

export interface AdicionarEpiCargoData {
  epi_id: number
  periodicidade_troca_dias: number
  quantidade_padrao?: number
  obrigatorio?: boolean
}

export interface AtualizarColaboradorEpiData {
  epiCargoId?: number | null
  gestorId?: number | null
  epiObservacoes?: string
}

export interface CriarMovimentacaoEpiData {
  colaborador_id: number
  epi_id: number
  tipo: string
  quantidade: number
  data_movimentacao: string
  responsavel: string
  proxima_entrega?: string
  motivo?: string
  observacoes?: string
  empresaId?: number
}

export interface CriarMovimentacaoEstoqueData {
  epi_id: number
  tipo: string
  quantidade: number
  data_movimentacao?: string
  responsavel: string
  observacoes?: string
  empresaId?: number
}

export interface CriarTransferenciaEpiData {
  produtoId: number
  empresaOrigemId: number
  empresaDestinoId: number
  quantidade: number
  dataTransferencia: string
  responsavel: string
  observacoes?: string
}

export interface RegistrarEntregaData {
  colaborador_id: number
  epi_id: number
  quantidade: number
  data_movimentacao: string
  responsavel: string
  proxima_entrega?: string
  empresaId?: number
  motivo?: string
  observacoes?: string
}

export abstract class EpiRepository {
  // Perfil
  abstract findGestorPerfil(userId: string): Promise<GestorPerfil>
  abstract findColaboradorIdByUserId(userId: string): Promise<number | null>

  // EPIs
  abstract findAllEpis(filters?: {
    categoria?: string
    status?: string
    search?: string
    baixo_estoque?: boolean
  }): Promise<epis[]>
  abstract findEpiById(id: number): Promise<EpiDetalhe | null>
  abstract createEpi(data: CriarEpiData, empresaId?: number): Promise<epis>
  abstract updateEpi(id: number, data: AtualizarEpiData): Promise<epis>
  abstract deleteEpi(id: number): Promise<void>

  // Cargos
  abstract findAllCargos(): Promise<CargoComCount[]>
  abstract findCargoById(
    id: number,
  ): Promise<(epi_cargos & { epis_obrigatorios: CargoEpiLink[] }) | null>
  abstract createCargo(data: CriarCargoEpiData): Promise<epi_cargos>
  abstract updateCargo(
    id: number,
    data: AtualizarCargoEpiData,
  ): Promise<epi_cargos>
  abstract deleteCargo(id: number): Promise<void>

  // Cargo-EPI links
  abstract findCargoEpiLinks(cargo_id?: number): Promise<CargoEpiLink[]>
  abstract createCargoEpiLink(
    data: AdicionarEpiCargoData & { cargo_id: number },
  ): Promise<CargoEpiLink>
  abstract deleteCargoEpiLink(id: number): Promise<void>

  // Colaboradores
  abstract findColaboradores(
    filters?: { empresaId?: number; status?: string },
    gestorColaboradorId?: number,
  ): Promise<ColaboradorEpi[]>
  abstract updateColaboradorEpi(
    id: number,
    data: AtualizarColaboradorEpiData,
  ): Promise<ColaboradorEpi>

  // Movimentacoes
  abstract findMovimentacoes(filters?: {
    colaborador_id?: number
    epi_id?: number
    tipo?: string
    empresaId?: number
  }): Promise<MovimentacaoEpiDetalhe[]>
  abstract findMovimentacoesByColaborador(
    colaboradorId: number,
  ): Promise<MovimentacaoEpiDetalhe[]>
  abstract createMovimentacao(
    data: CriarMovimentacaoEpiData,
  ): Promise<epi_movimentacoes>
  abstract createMovimentacaoHistorica(
    data: RegistrarEntregaData,
  ): Promise<epi_movimentacoes>

  // Estoque
  abstract findEstoque(filters?: {
    epi_id?: number
    empresaId?: number
  }): Promise<EstoqueResumo>
  abstract createEstoqueMovimentacao(
    data: CriarMovimentacaoEstoqueData,
  ): Promise<epi_estoque_movimentacoes>
  abstract updateEstoqueMovimentacao(
    id: number,
    data: Partial<CriarMovimentacaoEstoqueData>,
  ): Promise<epi_estoque_movimentacoes>
  abstract deleteEstoqueMovimentacao(id: number): Promise<void>

  // Saldo filiais
  abstract findSaldoFiliais(empresaId?: number): Promise<SaldoFiliaisResult>

  // Misc
  abstract findEmpresas(): Promise<
    {
      id: number
      nomeEmpresa: string
      cnpj: string | null
      cidade: string | null
    }[]
  >
  abstract findResponsaveis(): Promise<{ id: string; nome: string }[]>
  abstract findDashboard(empresaId?: number): Promise<DashboardData>
  abstract findAlertas(empresaId?: number): Promise<AlertasData>

  // Transferencias
  abstract findTransferencias(filters?: {
    page?: number
    limit?: number
    dataInicio?: string
    dataFim?: string
  }): Promise<{
    data: TransferenciaComDetalhes[]
    total: number
    pages: number
    page: number
  }>
  abstract createTransferencia(
    data: CriarTransferenciaEpiData,
  ): Promise<TransferenciaComDetalhes>
  abstract deleteTransferencia(id: number): Promise<void>
}
