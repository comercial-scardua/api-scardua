import { Injectable } from '@nestjs/common'
import { CriarNcSgqData, SgqRepository } from '../repositories/sgq-repository'

@Injectable()
export class CriarNaoConformidadeUseCase {
  constructor(private repo: SgqRepository) {}

  async execute(data: CriarNcSgqData) {
    return this.repo.createNC(data)
  }
}
