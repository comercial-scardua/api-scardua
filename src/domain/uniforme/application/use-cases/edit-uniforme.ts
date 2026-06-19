import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../../core/either'
import {
  UniformeRepository,
  type UniformeStatus,
} from '../repositories/uniforme-repository'
import { UniformeNaoEncontradoError } from './errors/uniforme-nao-encontrado.error'
import { toUniformeDTO, type UniformeDTO } from './list-uniformes'

export interface EditUniformeRequest {
  id: number
  nome?: string | null
  codigo?: string | null
  categoria?: string | null
  tamanho?: string | null
  fabricante?: string | null
  vida_util_dias?: number | null
  estoque_minimo?: number | null
  status?: string | null
  observacoes?: string | null
}

type EditUniformeResponse = Either<
  UniformeNaoEncontradoError,
  { uniforme: UniformeDTO }
>

@Injectable()
export class EditUniformeUseCase {
  constructor(private repo: UniformeRepository) {}

  async execute(req: EditUniformeRequest): Promise<EditUniformeResponse> {
    const existente = await this.repo.findUniformeById(req.id)
    if (!existente) return left(new UniformeNaoEncontradoError())

    const uniforme = await this.repo.updateUniforme(req.id, {
      nome: req.nome?.trim(),
      codigo: req.codigo?.trim(),
      categoria: req.categoria?.trim(),
      tamanho: req.tamanho?.trim() || null,
      fabricante: req.fabricante?.trim() || null,
      vida_util_dias:
        req.vida_util_dias != null ? Number(req.vida_util_dias) : undefined,
      estoque_minimo:
        req.estoque_minimo != null ? Number(req.estoque_minimo) : undefined,
      status: req.status
        ? (req.status.toUpperCase() as UniformeStatus)
        : undefined,
      observacoes: req.observacoes?.trim() || null,
    })

    return right({ uniforme: toUniformeDTO(uniforme) })
  }
}
