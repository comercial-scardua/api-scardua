import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../../core/either'
import { EstoqueRepository } from '../repositories/estoque-repository'
import { EntradaNaoEncontradaError } from './errors/entrada-nao-encontrada.error'

type ExcluirEntradaResult = Either<EntradaNaoEncontradaError, void>

@Injectable()
export class ExcluirEntradaUseCase {
  constructor(private repo: EstoqueRepository) {}

  async execute(id: number): Promise<ExcluirEntradaResult> {
    const existe = await this.repo.findEntradaById(id)
    if (!existe) return left(new EntradaNaoEncontradaError(id))

    await this.repo.excluirEntrada(id)
    return right(undefined)
  }
}
