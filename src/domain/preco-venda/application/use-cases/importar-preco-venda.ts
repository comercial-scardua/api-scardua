import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import {
  type ImportarPrecoVendaItem,
  type ImportarResultado,
  PrecoVendaRepository,
} from '../repositories/preco-venda-repository'

interface ImportarPrecoVendaRequest {
  itens: ImportarPrecoVendaItem[]
}

type ImportarPrecoVendaResponse = Either<
  never,
  { total: number; resultados: ImportarResultado[] }
>

@Injectable()
export class ImportarPrecoVendaUseCase {
  constructor(private repo: PrecoVendaRepository) {}

  async execute(
    req: ImportarPrecoVendaRequest,
  ): Promise<ImportarPrecoVendaResponse> {
    const resultados: ImportarResultado[] = []

    for (const item of req.itens) {
      const produto = await this.repo.findProdutoById(item.produtoId)

      if (!produto) {
        resultados.push({
          produtoId: item.produtoId,
          status: 'erro',
          erro: 'Produto não encontrado',
        })
        continue
      }

      let descricaoObj: Record<string, unknown> = {}
      if (produto.descricao) {
        try {
          descricaoObj = JSON.parse(produto.descricao)
        } catch {
          descricaoObj = { texto: produto.descricao }
        }
      }

      const descricaoAtualizada = JSON.stringify({
        ...descricaoObj,
        precoVenda: item.precoVenda,
      })

      await this.repo.updateProdutoDescricao(
        item.produtoId,
        descricaoAtualizada,
      )

      resultados.push({
        produtoId: item.produtoId,
        status: 'atualizado',
        precoVenda: item.precoVenda,
      })
    }

    return right({ total: req.itens.length, resultados })
  }
}
