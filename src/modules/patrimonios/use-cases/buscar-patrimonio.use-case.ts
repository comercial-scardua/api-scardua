import { Injectable } from '@nestjs/common';
import { type Either, left, right } from '../../../core/either';
import type { PatrimonioCompleto, PatrimoniosRepository } from '../repositories/patrimonios.repository';
import { PatrimonioNaoEncontradoError } from './errors/patrimonio-nao-encontrado.error';

type BuscarResult = Either<PatrimonioNaoEncontradoError, { patrimonio: PatrimonioCompleto }>;

@Injectable()
export class BuscarPatrimonioUseCase {
  constructor(private repo: PatrimoniosRepository) {}

  async execute(id: number): Promise<BuscarResult> {
    const patrimonio = await this.repo.findById(id);
    if (!patrimonio) return left(new PatrimonioNaoEncontradoError(id));
    return right({ patrimonio });
  }
}
