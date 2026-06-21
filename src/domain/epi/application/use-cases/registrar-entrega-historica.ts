import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../../core/either'
import type { RegistrarEntregaData } from '../repositories/epi-repository'
import { EpiRepository } from '../repositories/epi-repository'
import { EpiNaoEncontradoError } from './errors/epi-nao-encontrado.error'

type Result = Either<EpiNaoEncontradoError, { movimentacao: unknown }>

@Injectable()
export class RegistrarEntregaHistoricaUseCase {
  constructor(private repo: EpiRepository) {}

  async execute(dto: RegistrarEntregaData): Promise<Result> {
    const epi = await this.repo.findEpiById(dto.epi_id)
    if (!epi) return left(new EpiNaoEncontradoError(dto.epi_id))

    const movimentacao = await this.repo.createMovimentacaoHistorica({
      colaborador_id: dto.colaborador_id,
      epi_id: dto.epi_id,
      quantidade: dto.quantidade,
      data_movimentacao: dto.data_movimentacao,
      responsavel: dto.responsavel,
      motivo: dto.motivo,
      observacoes: dto.observacoes,
      empresaId: dto.empresaId,
    })

    return right({ movimentacao })
  }
}
