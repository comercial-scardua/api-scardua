import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'

type GetTemplateTabelaPrecoResponse = Either<never, { template: unknown }>

@Injectable()
export class GetTemplateTabelaPrecoUseCase {
  async execute(): Promise<GetTemplateTabelaPrecoResponse> {
    return right({
      template: {
        descricao: 'Template para importação de tabela de preços',
        formato: 'JSON',
        campos: [
          { campo: 'empresaId', tipo: 'number', obrigatorio: true },
          { campo: 'empresaNome', tipo: 'string', obrigatorio: true },
          {
            campo: 'itens',
            tipo: 'array',
            obrigatorio: true,
            subcampos: [
              { campo: 'produtoCodigo', tipo: 'string', obrigatorio: true },
              { campo: 'produtoNome', tipo: 'string', obrigatorio: true },
              { campo: 'precoVenda', tipo: 'number', obrigatorio: true },
              { campo: 'precoBase', tipo: 'number', obrigatorio: false },
              { campo: 'observacao', tipo: 'string', obrigatorio: false },
            ],
          },
        ],
        exemplo: {
          empresaId: 1,
          empresaNome: 'Empresa Exemplo',
          itens: [
            {
              produtoCodigo: 'PROD-001',
              produtoNome: 'Produto 1',
              precoVenda: 29.99,
              precoBase: 20.0,
            },
            {
              produtoCodigo: 'PROD-002',
              produtoNome: 'Produto 2',
              precoVenda: 49.9,
            },
          ],
        },
      },
    })
  }
}
