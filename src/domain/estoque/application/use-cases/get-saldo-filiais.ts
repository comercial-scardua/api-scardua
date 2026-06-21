import { Injectable } from '@nestjs/common'
import { right } from '../../../../core/either'
import { EstoqueRepository } from '../repositories/estoque-repository'

@Injectable()
export class GetSaldoFiliaisUseCase {
  constructor(private repo: EstoqueRepository) {}

  async execute(produtoId?: number, empresaId?: number) {
    const [produtos, empresas, saldos] = await Promise.all([
      this.repo.findProdutos({
        status: 'ATIVO',
        ...(produtoId && { search: String(produtoId) }),
      }),
      this.repo.findEmpresas(),
      this.repo.saldoFiliais(produtoId, empresaId),
    ])
    return right({ produtos: produtos.data, empresas, saldos })
  }
}
