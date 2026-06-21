export type GestorEmpresaColaborador = {
  id: number
  nome: string | null
  sobrenome: string | null
  email: string | null
}

export type GestorEmpresaEmpresa = {
  id: number
  nomeEmpresa: string
  cnpj: string | null
}

export type GestorEmpresaCompleta = {
  id: number
  colaboradorId: number
  empresaId: number
  colaborador: GestorEmpresaColaborador
  empresa: GestorEmpresaEmpresa
}

export interface FindAllGestorEmpresasFilters {
  empresaId?: number
  colaboradorId?: number
}

export interface CriarGestorEmpresaData {
  colaboradorId: number
  empresaId: number
}

export abstract class GestorEmpresasRepository {
  abstract findAll(
    filters: FindAllGestorEmpresasFilters,
  ): Promise<GestorEmpresaCompleta[]>
  abstract upsert(data: CriarGestorEmpresaData): Promise<GestorEmpresaCompleta>
}
