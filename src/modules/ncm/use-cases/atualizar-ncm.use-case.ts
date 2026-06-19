import { Injectable } from '@nestjs/common'
import type { ncm } from '@prisma/client'
import { type Either, left, right } from '../../../core/either'
import type { AtualizarNcmDto } from '../dto/atualizar-ncm.dto'
import { NcmRepository } from '../repositories/ncm.repository'
import { NcmNaoEncontradoError } from './errors/ncm-nao-encontrado.error'

type AtualizarNcmResult = Either<NcmNaoEncontradoError, { ncm: ncm }>

@Injectable()
export class AtualizarNcmUseCase {
  constructor(private repo: NcmRepository) {}

  async execute(id: number, dto: AtualizarNcmDto): Promise<AtualizarNcmResult> {
    const existe = await this.repo.findById(id)
    if (!existe) return left(new NcmNaoEncontradoError(id))

    const ncm = await this.repo.update(id, dto)
    return right({ ncm })
  }
}
