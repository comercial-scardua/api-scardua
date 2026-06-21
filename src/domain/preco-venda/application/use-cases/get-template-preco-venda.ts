import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'

type GetTemplatePrecoVendaResponse = Either<
  never,
  { template: Record<string, unknown> }
>

@Injectable()
export class GetTemplatePrecoVendaUseCase {
  async execute(): Promise<GetTemplatePrecoVendaResponse> {
    return right({
      template: {
        descricao: 'Template para importação de preços de venda',
        formato: 'JSON',
        campos: [
          {
            campo: 'produtoId',
            tipo: 'number',
            obrigatorio: true,
            descricao: 'ID do produto no sistema',
          },
          {
            campo: 'precoVenda',
            tipo: 'number',
            obrigatorio: true,
            descricao: 'Preço de venda em reais',
          },
        ],
        exemplo: {
          itens: [
            { produtoId: 1, precoVenda: 29.99 },
            { produtoId: 2, precoVenda: 49.9 },
          ],
        },
      },
    })
  }
}
