import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../../core/either'
import {
  type IncluirPrecoVendaData,
  PrecoVendaRepository,
  type ProdutoPrecoVenda,
} from '../repositories/preco-venda-repository'
import { ProdutoNaoEncontradoError } from './errors/produto-nao-encontrado.error'

interface IncluirPrecoVendaRequest {
  data: IncluirPrecoVendaData
}

type IncluirPrecoVendaResponse = Either<
  ProdutoNaoEncontradoError,
  { produto: ProdutoPrecoVenda; precoVenda: number }
>

@Injectable()
export class IncluirPrecoVendaUseCase {
  constructor(private repo: PrecoVendaRepository) {}

  async execute(
    req: IncluirPrecoVendaRequest,
  ): Promise<IncluirPrecoVendaResponse> {
    const { data } = req

    const produto = await this.repo.findProdutoById(data.produtoId)
    if (!produto) {
      return left(new ProdutoNaoEncontradoError(data.produtoId))
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
      precoVenda: data.precoVenda,
      observacao: data.observacao ?? undefined,
    })

    const atualizado = await this.repo.updateProdutoDescricao(
      data.produtoId,
      descricaoAtualizada,
    )

    return right({ produto: atualizado, precoVenda: data.precoVenda })
  }
}
