import { Injectable } from '@nestjs/common'
import {
  CriarProcessoSgqData,
  SgqRepository,
} from '../repositories/sgq-repository'

@Injectable()
export class CriarProcessoUseCase {
  constructor(private repo: SgqRepository) {}

  async execute(data: CriarProcessoSgqData) {
    return this.repo.createProcesso(data)
  }
}
