import { Injectable } from '@nestjs/common'
import { SgqRepository } from '../repositories/sgq-repository'

interface ListarHelpRequest {
  filters: {
    category?: string
    module?: string
  }
}

@Injectable()
export class ListarHelpUseCase {
  constructor(private repo: SgqRepository) {}

  async execute({ filters }: ListarHelpRequest) {
    return this.repo.findHelpArticles(filters)
  }
}
