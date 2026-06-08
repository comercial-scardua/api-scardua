import { Injectable } from '@nestjs/common';
import type { contratos } from '@prisma/client';
import { type Either, left, right } from '../../../core/either';
import type { AtualizarContratoDto } from '../dto/atualizar-contrato.dto';
import { ContratosRepository } from '../repositories/contratos.repository';
import { ContratoNaoEncontradoError } from './errors/contrato-nao-encontrado.error';

type AtualizarContratoResult = Either<ContratoNaoEncontradoError, { contrato: contratos }>;

@Injectable()
export class AtualizarContratoUseCase {
  constructor(private repo: ContratosRepository) {}

  async execute(id: number, dto: AtualizarContratoDto): Promise<AtualizarContratoResult> {
    const existe = await this.repo.findById(id);
    if (!existe) return left(new ContratoNaoEncontradoError(id));

    const contrato = await this.repo.update(id, dto);
    return right({ contrato });
  }
}
