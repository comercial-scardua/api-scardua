import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../../core/either'
import { EstoqueRepository } from '../repositories/estoque-repository'
import { SaidaNaoEncontradaError } from './errors/saida-nao-encontrada.error'

type ExcluirSaidaResult = Either<SaidaNaoEncontradaError, void>

@Injectable()
export class ExcluirSaidaUseCase {
  constructor(private repo: EstoqueRepository) {}

  async execute(id: number): Promise<ExcluirSaidaResult> {
    const existe = await this.repo.findSaidaById(id)
    if (!existe) return left(new SaidaNaoEncontradaError(id))

    await this.repo.excluirSaida(id)
    return right(undefined)
  }
}
