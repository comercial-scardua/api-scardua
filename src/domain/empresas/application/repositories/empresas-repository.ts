export type EmpresaSimples = {
  id: number
  numero: string | null
  nomeEmpresa: string
  cnpj: string | null
  cidade: string | null
}

export type EmpresaCompleta = EmpresaSimples & {
  oculto: boolean
  createdAt: Date
  updatedAt: Date
  criadoPor: { id: string; nome: string; email: string } | null
  colaboradores: { id: number; nome: string | null; sobrenome: string | null }[]
}

export type ListaEmpresasResult = {
  data: EmpresaCompleta[]
  total: number
  pages: number
  page: number
}

export interface FindAllEmpresasFilters {
  searchTerm?: string
  mostrarOcultos?: boolean
  page?: number
  limit?: number
}

export interface CreateEmpresaData {
  nomeEmpresa: string
  cnpj?: string
  numero?: string
  cidade?: string
}

export type UpdateEmpresaData = Partial<CreateEmpresaData> & {
  oculto?: boolean
}

export abstract class EmpresasRepository {
  abstract findAll(
    filters: FindAllEmpresasFilters,
  ): Promise<ListaEmpresasResult>
  abstract findSimple(): Promise<EmpresaSimples[]>
  abstract findById(id: number): Promise<EmpresaCompleta | null>
  abstract findByCnpj(cnpj: string): Promise<EmpresaSimples | null>
  abstract create(
    data: CreateEmpresaData,
    criadoPorId: string,
  ): Promise<EmpresaCompleta>
  abstract update(id: number, data: UpdateEmpresaData): Promise<EmpresaCompleta>
  abstract softDelete(id: number): Promise<EmpresaCompleta>
}
