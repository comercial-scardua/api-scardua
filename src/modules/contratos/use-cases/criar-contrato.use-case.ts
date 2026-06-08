import { Injectable } from '@nestjs/common';
import type { contratos } from '@prisma/client';
import { type Either, left, right } from '../../../core/either';
import type { CriarContratoDto } from '../dto/criar-contrato.dto';
import { ContratosRepository } from '../repositories/contratos.repository';
import { NumeroJaCadastradoError } from './errors/numero-ja-cadastrado.error';

type CriarContratoResult = Either<NumeroJaCadastradoError, { contrato: contratos }>;

@Injectable()
export class CriarContratoUseCase {
  constructor(private repo: ContratosRepository) {}

  async execute(dto: CriarContratoDto): Promise<CriarContratoResult> {
    const existente = await this.repo.findByNumero(dto.numero);
    if (existente) return left(new NumeroJaCadastradoError(dto.numero));

    const contrato = await this.repo.create(dto);
    return right({ contrato });
  }
}
