import { Injectable } from '@nestjs/common'
import type { stock_entries } from '@prisma/client'
import { type Either, left, right } from '../../../../core/either'
import { EstoqueRepository } from '../repositories/estoque-repository'
import { EntradaNaoEncontradaError } from './errors/entrada-nao-encontrada.error'

type UpdateEntradaResult = Either<
  EntradaNaoEncontradaError,
  { entrada: stock_entries }
>

@Injectable()
export class UpdateEntradaUseCase {
  constructor(private repo: EstoqueRepository) {}

  async execute(
    id: number,
    data: Record<string, unknown>,
  ): Promise<UpdateEntradaResult> {
    const existe = await this.repo.findEntradaById(id)
    if (!existe) return left(new EntradaNaoEncontradaError(id))

    const entrada = await this.repo.updateEntrada(id, data)
    return right({ entrada })
  }
}
