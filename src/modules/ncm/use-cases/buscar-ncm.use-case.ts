import { Injectable } from '@nestjs/common';
import type { ncm } from '@prisma/client';
import { type Either, left, right } from '../../../core/either';
import { NcmRepository } from '../repositories/ncm.repository';
import { NcmNaoEncontradoError } from './errors/ncm-nao-encontrado.error';

type BuscarNcmResult = Either<NcmNaoEncontradoError, { ncm: ncm }>;

@Injectable()
export class BuscarNcmUseCase {
  constructor(private repo: NcmRepository) {}

  async execute(id: number): Promise<BuscarNcmResult> {
    const ncm = await this.repo.findById(id);
    if (!ncm) return left(new NcmNaoEncontradoError(id));
    return right({ ncm });
  }
}
