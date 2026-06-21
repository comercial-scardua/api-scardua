import { Injectable } from '@nestjs/common'
import { SgqRepository } from '../repositories/sgq-repository'

@Injectable()
export class ListarArquivosUseCase {
  constructor(private repo: SgqRepository) {}

  async execute() {
    return this.repo.findDocumentosComArquivo()
  }
}
