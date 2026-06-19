import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import {
  UniformeRepository,
  type UniformeRow,
} from '../repositories/uniforme-repository'

export interface UniformeDTO {
  id: number
  nome: string
  codigo: string
  categoria: string
  tamanho: string
  fabricante: string
  vida_util_dias: number
  estoque_inicial: number
  estoque_atual: number
  estoque_minimo: number
  status: 'ativo' | 'inativo'
  observacoes: string
  createdAt: Date
  updatedAt: Date
}

export function toUniformeDTO(u: UniformeRow): UniformeDTO {
  return {
    ...u,
    status: u.status.toLowerCase() as 'ativo' | 'inativo',
    observacoes: u.observacoes ?? '',
    tamanho: u.tamanho ?? '',
    fabricante: u.fabricante ?? '',
  }
}

type ListUniformesResponse = Either<never, { uniformes: UniformeDTO[] }>

@Injectable()
export class ListUniformesUseCase {
  constructor(private repo: UniformeRepository) {}

  async execute(): Promise<ListUniformesResponse> {
    const uniformes = await this.repo.listUniformes()
    return right({ uniformes: uniformes.map(toUniformeDTO) })
  }
}
