import { Injectable } from '@nestjs/common'
import { SgqRepository } from '../repositories/sgq-repository'

interface ListarDocumentosRequest {
  filters: {
    status?: string
    type?: string
    processId?: number
    search?: string
  }
}

@Injectable()
export class ListarDocumentosUseCase {
  constructor(private repo: SgqRepository) {}

  async execute({ filters }: ListarDocumentosRequest) {
    return this.repo.findAllDocumentos(filters)
  }
}
