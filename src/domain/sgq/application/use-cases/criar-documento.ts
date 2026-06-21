import { Injectable } from '@nestjs/common'
import {
  CriarDocumentoSgqData,
  SgqRepository,
} from '../repositories/sgq-repository'

@Injectable()
export class CriarDocumentoUseCase {
  constructor(private repo: SgqRepository) {}

  async execute(data: CriarDocumentoSgqData) {
    return this.repo.createDocumento(data)
  }
}
