import { Injectable } from '@nestjs/common'
import type { stock_entries } from '@prisma/client'
import { type Either, left, right } from '../../../../core/either'
import { EstoqueRepository } from '../repositories/estoque-repository'
import { EntradaNaoEncontradaError } from './errors/entrada-nao-encontrada.error'

type GetEntradaResult = Either<
  EntradaNaoEncontradaError,
  { entrada: stock_entries }
>

@Injectable()
export class GetEntradaUseCase {
  constructor(private repo: EstoqueRepository) {}

  async execute(id: number): Promise<GetEntradaResult> {
    const entrada = await this.repo.findEntradaById(id)
    if (!entrada) return left(new EntradaNaoEncontradaError(id))
    return right({ entrada })
  }
}
