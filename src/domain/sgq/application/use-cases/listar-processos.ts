import { Injectable } from '@nestjs/common'
import { SgqRepository } from '../repositories/sgq-repository'

interface ListarProcessosRequest {
  filters: {
    status?: string
    search?: string
  }
}

@Injectable()
export class ListarProcessosUseCase {
  constructor(private repo: SgqRepository) {}

  async execute({ filters }: ListarProcessosRequest) {
    return this.repo.findAllProcessos(filters)
  }
}
