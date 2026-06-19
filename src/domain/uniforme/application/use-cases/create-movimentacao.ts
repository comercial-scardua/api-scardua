import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../../core/either'
import {
  type MovimentacaoTipo,
  UniformeRepository,
} from '../repositories/uniforme-repository'
import { EstoqueInsuficienteError } from './errors/estoque-insuficiente.error'
import { UniformeNaoEncontradoError } from './errors/uniforme-nao-encontrado.error'
import { type MovimentacaoDTO, toMovimentacaoDTO } from './list-movimentacoes'

const TIPOS_QUE_CONSOMEM: MovimentacaoTipo[] = ['ENTREGA', 'TROCA', 'PERDA']

export interface CreateMovimentacaoRequest {
  colaborador_id: number
  uniforme_id: number
  tipo?: string | null
  quantidade: number
  data_movimentacao: string
  responsavel: string
  proxima_entrega?: string | null
  motivo?: string | null
  observacoes?: string | null
  empresaId?: number | null
}

type CreateMovimentacaoResponse = Either<
  UniformeNaoEncontradoError | EstoqueInsuficienteError,
  { movimentacao: MovimentacaoDTO }
>

@Injectable()
export class CreateMovimentacaoUseCase {
  constructor(private repo: UniformeRepository) {}

  async execute(
    req: CreateMovimentacaoRequest,
  ): Promise<CreateMovimentacaoResponse> {
    const uniforme = await this.repo.findUniformeById(Number(req.uniforme_id))
    if (!uniforme) return left(new UniformeNaoEncontradoError())

    const tipo = (req.tipo?.toUpperCase() || 'ENTREGA') as MovimentacaoTipo
    const quantidade = Number(req.quantidade)

    if (
      TIPOS_QUE_CONSOMEM.includes(tipo) &&
      uniforme.estoque_atual < quantidade
    ) {
      return left(
        new EstoqueInsuficienteError(uniforme.nome, uniforme.estoque_atual),
      )
    }

    const movimentacao = await this.repo.createMovimentacao({
      colaborador_id: Number(req.colaborador_id),
      uniforme_id: Number(req.uniforme_id),
      tipo,
      quantidade,
      data_movimentacao: new Date(req.data_movimentacao),
      responsavel: req.responsavel.trim(),
      proxima_entrega: req.proxima_entrega
        ? new Date(req.proxima_entrega)
        : null,
      motivo: req.motivo?.trim() || null,
      observacoes: req.observacoes?.trim() || null,
      empresaId: req.empresaId ? Number(req.empresaId) : null,
    })

    return right({ movimentacao: toMovimentacaoDTO(movimentacao) })
  }
}
