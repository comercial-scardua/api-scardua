import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../../core/either'
import { NcmRepository } from '../repositories/ncm-repository'
import { NcmNaoEncontradoError } from './errors/ncm-nao-encontrado.error'

type DesativarNcmResult = Either<NcmNaoEncontradoError, null>

@Injectable()
export class DesativarNcmUseCase {
  constructor(private repo: NcmRepository) {}

  async execute(id: number): Promise<DesativarNcmResult> {
    const existe = await this.repo.findById(id)
    if (!existe) return left(new NcmNaoEncontradoError(id))

    await this.repo.desativar(id)
    return right(null)
  }
}
