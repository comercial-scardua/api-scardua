import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../../core/either'
import {
  UniformeRepository,
  type UniformeStatus,
} from '../repositories/uniforme-repository'
import { CodigoJaCadastradoError } from './errors/codigo-ja-cadastrado.error'
import { toUniformeDTO, type UniformeDTO } from './list-uniformes'

export interface CreateUniformeRequest {
  nome: string
  codigo: string
  categoria: string
  tamanho?: string | null
  fabricante?: string | null
  vida_util_dias?: number | null
  estoque_atual?: number | null
  estoque_minimo?: number | null
  status?: string | null
  observacoes?: string | null
}

type CreateUniformeResponse = Either<
  CodigoJaCadastradoError,
  { uniforme: UniformeDTO }
>

@Injectable()
export class CreateUniformeUseCase {
  constructor(private repo: UniformeRepository) {}

  async execute(req: CreateUniformeRequest): Promise<CreateUniformeResponse> {
    const codigo = req.codigo.trim()

    const existente = await this.repo.findUniformeByCodigo(codigo)
    if (existente) return left(new CodigoJaCadastradoError(codigo))

    const estoqueInicial = Number(req.estoque_atual) || 0

    const uniforme = await this.repo.createUniforme({
      nome: req.nome.trim(),
      codigo,
      categoria: req.categoria.trim(),
      tamanho: req.tamanho?.trim() || null,
      fabricante: req.fabricante?.trim() || null,
      vida_util_dias: Number(req.vida_util_dias) || 365,
      estoque_inicial: estoqueInicial,
      estoque_atual: estoqueInicial,
      estoque_minimo: Number(req.estoque_minimo) || 0,
      status: (req.status?.toUpperCase() || 'ATIVO') as UniformeStatus,
      observacoes: req.observacoes?.trim() || null,
    })

    return right({ uniforme: toUniformeDTO(uniforme) })
  }
}
