import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import {
  type ListMovimentacoesFilters,
  type MovimentacaoRow,
  UniformeRepository,
} from '../repositories/uniforme-repository'

export interface MovimentacaoDTO {
  id: number
  colaborador_id: number
  uniforme_id: number
  tipo: string
  quantidade: number
  data_movimentacao: string
  responsavel: string
  proxima_entrega: string
  motivo: string
  observacoes: string
}

export function toMovimentacaoDTO(m: MovimentacaoRow): MovimentacaoDTO {
  return {
    id: m.id,
    colaborador_id: m.colaborador_id,
    uniforme_id: m.uniforme_id,
    tipo: m.tipo.toLowerCase(),
    quantidade: m.quantidade,
    data_movimentacao: m.data_movimentacao.toISOString().split('T')[0],
    responsavel: m.responsavel,
    proxima_entrega: m.proxima_entrega
      ? m.proxima_entrega.toISOString().split('T')[0]
      : '',
    motivo: m.motivo ?? '',
    observacoes: m.observacoes ?? '',
  }
}

type ListMovimentacoesResponse = Either<
  never,
  { movimentacoes: MovimentacaoDTO[] }
>

@Injectable()
export class ListMovimentacoesUseCase {
  constructor(private repo: UniformeRepository) {}

  async execute(
    filters: ListMovimentacoesFilters,
  ): Promise<ListMovimentacoesResponse> {
    const movs = await this.repo.listMovimentacoes(filters)
    return right({ movimentacoes: movs.map(toMovimentacaoDTO) })
  }
}
