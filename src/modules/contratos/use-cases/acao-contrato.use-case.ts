import { Injectable } from '@nestjs/common';
import type { contratos } from '@prisma/client';
import { type Either, left, right } from '../../../core/either';
import type { ContratosRepository } from '../repositories/contratos.repository';
import { ContratoNaoEncontradoError } from './errors/contrato-nao-encontrado.error';

export type AcaoContrato = 'finalizar' | 'renovar';

type AcaoContratoResult = Either<ContratoNaoEncontradoError, { contrato: contratos }>;

@Injectable()
export class AcaoContratoUseCase {
  constructor(private repo: ContratosRepository) {}

  async execute(id: number, acao: AcaoContrato): Promise<AcaoContratoResult> {
    const existe = await this.repo.findById(id);
    if (!existe) return left(new ContratoNaoEncontradoError(id));

    const contrato =
      acao === 'finalizar'
        ? await this.repo.alternarStatus(id)
        : await this.repo.renovar(id);

    return right({ contrato });
  }
}
