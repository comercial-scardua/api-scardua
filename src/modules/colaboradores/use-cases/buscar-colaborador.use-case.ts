import { Injectable } from '@nestjs/common';
import { type Either, left, right } from '../../../core/either';
import type { ColaboradoresRepository } from '../repositories/colaboradores.repository';
import { ColaboradorNaoEncontradoError } from './errors/colaborador-nao-encontrado.error';

type BuscarColaboradorResult = Either<
  ColaboradorNaoEncontradoError,
  { colaborador: Awaited<ReturnType<ColaboradoresRepository['findById']>> }
>;

@Injectable()
export class BuscarColaboradorUseCase {
  constructor(private repo: ColaboradoresRepository) {}

  async execute(id: number): Promise<BuscarColaboradorResult> {
    const colaborador = await this.repo.findById(id);
    if (!colaborador) return left(new ColaboradorNaoEncontradoError(id));
    return right({ colaborador });
  }
}
