import { Injectable } from '@nestjs/common'
import type { stock_exits } from '@prisma/client'
import { type Either, left, right } from '../../../../core/either'
import { EstoqueRepository } from '../repositories/estoque-repository'
import { SaidaNaoEncontradaError } from './errors/saida-nao-encontrada.error'

type GetSaidaResult = Either<SaidaNaoEncontradaError, { saida: stock_exits }>

@Injectable()
export class GetSaidaUseCase {
  constructor(private repo: EstoqueRepository) {}

  async execute(id: number): Promise<GetSaidaResult> {
    const saida = await this.repo.findSaidaById(id)
    if (!saida) return left(new SaidaNaoEncontradaError(id))
    return right({ saida })
  }
}
