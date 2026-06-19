import type { erro_arquivos, erros_solucoes } from '@prisma/client'

export interface FindAllErrosFilters {
  categoria?: string
  restrito?: boolean
  search?: string
}

export interface CreateErroData {
  titulo: string
  categoria: string
  descricao?: string | null
  solucao?: string | null
  usuario_id?: number | null
  usuario_nome?: string | null
  tags?: string | null
  restrito?: boolean
  ativo?: boolean
}

export type UpdateErroData = Partial<CreateErroData>

export type ErroComArquivos = erros_solucoes & { arquivos: erro_arquivos[] }

export abstract class ErrosRepository {
  abstract findAll(filters: FindAllErrosFilters): Promise<erros_solucoes[]>
  abstract findById(id: number): Promise<ErroComArquivos | null>
  abstract create(data: CreateErroData): Promise<erros_solucoes>
  abstract update(id: number, data: UpdateErroData): Promise<erros_solucoes>
}
