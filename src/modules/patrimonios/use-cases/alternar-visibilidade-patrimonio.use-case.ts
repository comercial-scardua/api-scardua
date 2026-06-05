import { Injectable } from '@nestjs/common';
import { type Either, left, right } from '../../../core/either';
import type { PatrimoniosRepository } from '../repositories/patrimonios.repository';
import { PatrimonioNaoEncontradoError } from './errors/patrimonio-nao-encontrado.error';

type AlternarResult = Either<PatrimonioNaoEncontradoError, { oculto: boolean }>;

@Injectable()
export class AlternarVisibilidadePatrimonioUseCase {
  constructor(private repo: PatrimoniosRepository) {}

  async execute(id: number): Promise<AlternarResult> {
    const existe = await this.repo.findById(id);
    if (!existe) return left(new PatrimonioNaoEncontradoError(id));

    const atualizado = await this.repo.toggleOculto(id);
    return right({ oculto: atualizado.oculto });
  }
}
