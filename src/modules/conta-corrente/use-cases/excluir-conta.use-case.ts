import { Injectable } from '@nestjs/common';
import { type Either, left, right } from '../../../core/either';
import { ContaCorrenteRepository } from '../repositories/conta-corrente.repository';
import { ContaNaoEncontradaError } from './errors/conta-nao-encontrada.error';

type ExcluirContaResult = Either<ContaNaoEncontradaError, null>;

@Injectable()
export class ExcluirContaUseCase {
  constructor(private repo: ContaCorrenteRepository) {}

  async execute(id: number): Promise<ExcluirContaResult> {
    const existe = await this.repo.findById(id);
    if (!existe) return left(new ContaNaoEncontradaError(id));

    await this.repo.excluir(id);
    return right(null);
  }
}
