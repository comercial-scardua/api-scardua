import { Injectable } from '@nestjs/common'
import type { ncm } from '@prisma/client'
import { type Either, left, right } from '../../../../core/either'
import type { AtualizarNcmData } from '../repositories/ncm-repository'
import { NcmRepository } from '../repositories/ncm-repository'
import { NcmNaoEncontradoError } from './errors/ncm-nao-encontrado.error'

type AtualizarNcmResult = Either<NcmNaoEncontradoError, { ncm: ncm }>

@Injectable()
export class AtualizarNcmUseCase {
  constructor(private repo: NcmRepository) {}

  async execute(
    id: number,
    data: AtualizarNcmData,
  ): Promise<AtualizarNcmResult> {
    const existe = await this.repo.findById(id)
    if (!existe) return left(new NcmNaoEncontradoError(id))

    const ncm = await this.repo.update(id, data)
    return right({ ncm })
  }
}
