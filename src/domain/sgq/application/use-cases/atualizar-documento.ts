import { Injectable } from '@nestjs/common'
import {
  CriarDocumentoSgqData,
  SgqRepository,
} from '../repositories/sgq-repository'

@Injectable()
export class AtualizarDocumentoUseCase {
  constructor(private repo: SgqRepository) {}

  async execute(id: number, data: Partial<CriarDocumentoSgqData>) {
    return this.repo.updateDocumento(id, data)
  }
}
