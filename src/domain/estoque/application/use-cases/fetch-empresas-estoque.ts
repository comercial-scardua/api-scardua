import { Injectable } from '@nestjs/common'
import { right } from '../../../../core/either'
import { EstoqueRepository } from '../repositories/estoque-repository'

@Injectable()
export class FetchEmpresasEstoqueUseCase {
  constructor(private repo: EstoqueRepository) {}

  async execute() {
    const empresas = await this.repo.findEmpresas()
    return right(empresas)
  }
}
