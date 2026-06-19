export type UniformeStatus = 'ATIVO' | 'INATIVO'

export type MovimentacaoTipo =
  | 'ENTREGA'
  | 'DEVOLUCAO'
  | 'TROCA'
  | 'PERDA'
  | 'BAIXA'

export type UniformeRow = {
  id: number
  nome: string
  codigo: string
  categoria: string
  tamanho: string | null
  fabricante: string | null
  vida_util_dias: number
  estoque_inicial: number
  estoque_atual: number
  estoque_minimo: number
  status: UniformeStatus
  observacoes: string | null
  createdAt: Date
  updatedAt: Date
}

export interface CreateUniformeData {
  nome: string
  codigo: string
  categoria: string
  tamanho: string | null
  fabricante: string | null
  vida_util_dias: number
  estoque_inicial: number
  estoque_atual: number
  estoque_minimo: number
  status: UniformeStatus
  observacoes: string | null
}

export interface UpdateUniformeData {
  nome?: string
  codigo?: string
  categoria?: string
  tamanho?: string | null
  fabricante?: string | null
  vida_util_dias?: number
  estoque_minimo?: number
  status?: UniformeStatus
  observacoes?: string | null
}

export type DepartamentoRow = {
  id: number
  nome: string
  descricao: string | null
  tipo: string
}

export type CargoUniformeRow = {
  id: number
  cargo_id: number
  uniforme_id: number
  periodicidade_troca_dias: number
  quantidade_padrao: number
  obrigatorio: boolean
}

export interface CreateCargoUniformeData {
  cargo_id: number
  uniforme_id: number
  periodicidade_troca_dias: number
  quantidade_padrao: number
  obrigatorio: boolean
}

export type ColaboradorRow = {
  id: number
  nome: string | null
  sobrenome: string | null
  numeroEmpresa: string | null
  epiCargoId: number | null
  cargo: string | null
  setor: string | null
  oculto: boolean
  demissao: Date | null
  admissao: Date | null
  empresaId: number | null
  isGestor: boolean
  epiObservacoes: string | null
  empresa: { id: number; nomeEmpresa: string; cnpj: string | null } | null
  gestoresRelacao: {
    gestor: { id: number; nome: string | null; sobrenome: string | null }
  }[]
}

export interface ListColaboradoresFilters {
  empresaId?: number
  status?: 'ativo' | 'inativo'
  gestorId?: number
}

export interface UpdateColaboradorData {
  epiCargoId?: number | null
  epiObservacoes?: string
}

export type MovimentacaoRow = {
  id: number
  colaborador_id: number
  uniforme_id: number
  tipo: MovimentacaoTipo
  quantidade: number
  data_movimentacao: Date
  responsavel: string
  proxima_entrega: Date | null
  motivo: string | null
  observacoes: string | null
}

export interface ListMovimentacoesFilters {
  colaboradorId?: number
  uniformeId?: number
  tipo?: MovimentacaoTipo
  empresaId?: number
}

export interface CreateMovimentacaoData {
  colaborador_id: number
  uniforme_id: number
  tipo: MovimentacaoTipo
  quantidade: number
  data_movimentacao: Date
  responsavel: string
  proxima_entrega: Date | null
  motivo: string | null
  observacoes: string | null
  empresaId: number | null
}

export type EmpresaSimples = {
  id: number
  nomeEmpresa: string
  cnpj: string | null
  cidade: string | null
}

export type ResponsavelRow = { id: string; nome: string }

export type GestorEmpresaRow = {
  empresaId: number
  empresa: { nomeEmpresa: string }
}

export type ColaboradorAuth = { id: number; isGestor: boolean }

export abstract class UniformeRepository {
  // uniformes
  abstract listUniformes(): Promise<UniformeRow[]>
  abstract findUniformeById(id: number): Promise<UniformeRow | null>
  abstract findUniformeByCodigo(codigo: string): Promise<UniformeRow | null>
  abstract createUniforme(data: CreateUniformeData): Promise<UniformeRow>
  abstract updateUniforme(
    id: number,
    data: UpdateUniformeData,
  ): Promise<UniformeRow>

  // departamentos (epi_cargos tipo = departamento)
  abstract listDepartamentos(): Promise<DepartamentoRow[]>
  abstract createDepartamento(
    nome: string,
    descricao: string | null,
  ): Promise<DepartamentoRow>
  abstract countVinculosByCargo(cargoId: number): Promise<number>
  abstract deleteDepartamento(id: number): Promise<void>

  // cargo-uniforme
  abstract listCargoUniforme(): Promise<CargoUniformeRow[]>
  abstract createCargoUniforme(
    data: CreateCargoUniformeData,
  ): Promise<CargoUniformeRow>
  abstract deleteCargoUniforme(id: number): Promise<void>

  // colaboradores
  abstract findUserAuth(
    userId: string,
  ): Promise<{ role: string; cpf: string | null } | null>
  abstract findGestorColaboradorByUserId(
    userId: string,
  ): Promise<ColaboradorAuth | null>
  abstract findColaboradorByUserId(
    userId: string,
  ): Promise<ColaboradorAuth | null>
  abstract findGestorByCpf(cpf: string): Promise<ColaboradorAuth | null>
  abstract listColaboradores(
    filters: ListColaboradoresFilters,
  ): Promise<ColaboradorRow[]>
  abstract updateColaborador(
    id: number,
    data: UpdateColaboradorData,
  ): Promise<{ id: number; epiCargoId: number | null }>
  abstract listGestorEmpresas(
    colaboradorId: number,
  ): Promise<GestorEmpresaRow[]>

  // movimentacoes
  abstract listMovimentacoes(
    filters: ListMovimentacoesFilters,
  ): Promise<MovimentacaoRow[]>
  abstract createMovimentacao(
    data: CreateMovimentacaoData,
  ): Promise<MovimentacaoRow>

  // shared
  abstract listEmpresas(): Promise<EmpresaSimples[]>
  abstract listResponsaveis(): Promise<ResponsavelRow[]>
}
