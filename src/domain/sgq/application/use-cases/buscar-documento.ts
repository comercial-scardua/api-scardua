import { Injectable } from '@nestjs/common'
import { SgqRepository } from '../repositories/sgq-repository'

@Injectable()
export class BuscarDocumentoUseCase {
  constructor(private repo: SgqRepository) {}

  async execute(id: number) {
    return this.repo.findDocumentoById(id)
  }
}
