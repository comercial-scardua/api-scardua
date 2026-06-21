import { Injectable } from '@nestjs/common'
import { SgqRepository } from '../repositories/sgq-repository'

interface ListarNaoConformidadesRequest {
  filters: {
    status?: string
    origin?: string
    processId?: number
  }
}

@Injectable()
export class ListarNaoConformidadesUseCase {
  constructor(private repo: SgqRepository) {}

  async execute({ filters }: ListarNaoConformidadesRequest) {
    return this.repo.findAllNCs(filters)
  }
}
