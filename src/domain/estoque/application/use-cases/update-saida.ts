import { Injectable } from '@nestjs/common'
import type { stock_exits } from '@prisma/client'
import { type Either, left, right } from '../../../../core/either'
import { EstoqueRepository } from '../repositories/estoque-repository'
import { SaidaNaoEncontradaError } from './errors/saida-nao-encontrada.error'

type UpdateSaidaResult = Either<SaidaNaoEncontradaError, { saida: stock_exits }>

@Injectable()
export class UpdateSaidaUseCase {
  constructor(private repo: EstoqueRepository) {}

  async execute(
    id: number,
    data: Record<string, unknown>,
  ): Promise<UpdateSaidaResult> {
    const existe = await this.repo.findSaidaById(id)
    if (!existe) return left(new SaidaNaoEncontradaError(id))

    const saida = await this.repo.updateSaida(id, data)
    return right({ saida })
  }
}
