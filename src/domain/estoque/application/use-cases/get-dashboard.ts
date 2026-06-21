import { Injectable } from '@nestjs/common'
import { right } from '../../../../core/either'
import { EstoqueRepository } from '../repositories/estoque-repository'

@Injectable()
export class GetDashboardUseCase {
  constructor(private repo: EstoqueRepository) {}

  async execute() {
    const dashboard = await this.repo.dashboard()
    return right(dashboard)
  }
}
