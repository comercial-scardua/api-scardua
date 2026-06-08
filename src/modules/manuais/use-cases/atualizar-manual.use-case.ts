import { Injectable } from '@nestjs/common';
import { type Either, left, right } from '../../../core/either';
import type { AtualizarManualDto } from '../dto/atualizar-manual.dto';
import { ManuaisRepository } from '../repositories/manuais.repository'
import type { ManualCompleto } from '../repositories/manuais.repository';
import { ManualNaoEncontradoError } from './errors/manual-nao-encontrado.error';

type AtualizarManualResult = Either<ManualNaoEncontradoError, { manual: ManualCompleto }>;

@Injectable()
export class AtualizarManualUseCase {
  constructor(private repo: ManuaisRepository) {}

  async execute(id: number, dto: AtualizarManualDto): Promise<AtualizarManualResult> {
    const existe = await this.repo.findById(id);
    if (!existe) return left(new ManualNaoEncontradoError(id));

    const manual = await this.repo.update(id, dto);
    return right({ manual });
  }
}
