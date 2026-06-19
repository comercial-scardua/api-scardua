import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import {
  type ColaboradorRow,
  type ListColaboradoresFilters,
  UniformeRepository,
} from '../repositories/uniforme-repository'

export interface ColaboradorDTO {
  id: number
  nome: string
  matricula: string
  cargo_id: number
  cargo: string
  setor: string
  unidade: string
  data_admissao: string
  status: 'ativo' | 'inativo'
  gestores: { id: number; nome: string }[]
  observacoes: string
  isGestor: boolean
  empresaId: number | null
  empresaNome: string | null
  empresaCnpj: string | null
}

function mapColaborador(c: ColaboradorRow): ColaboradorDTO {
  return {
    id: c.id,
    nome: [c.nome, c.sobrenome].filter(Boolean).join(' '),
    matricula: c.numeroEmpresa ?? '',
    cargo_id: c.epiCargoId ?? 0,
    cargo: c.cargo ?? '',
    setor: c.setor ?? '',
    unidade: c.empresa?.nomeEmpresa ?? '',
    data_admissao: c.admissao ? c.admissao.toISOString().split('T')[0] : '',
    status: c.oculto ? 'inativo' : 'ativo',
    gestores: c.gestoresRelacao.map((g) => ({
      id: g.gestor.id,
      nome: [g.gestor.nome, g.gestor.sobrenome].filter(Boolean).join(' '),
    })),
    observacoes: c.epiObservacoes ?? '',
    isGestor: c.isGestor,
    empresaId: c.empresaId ?? null,
    empresaNome: c.empresa?.nomeEmpresa ?? null,
    empresaCnpj: c.empresa?.cnpj ?? null,
  }
}

export interface ListColaboradoresRequest {
  userId: string
  empresaId?: number
  status?: 'ativo' | 'inativo'
}

type ListColaboradoresResponse = Either<
  never,
  { colaboradores: ColaboradorDTO[] }
>

@Injectable()
export class ListColaboradoresUseCase {
  constructor(private repo: UniformeRepository) {}

  async execute(
    req: ListColaboradoresRequest,
  ): Promise<ListColaboradoresResponse> {
    const filters: ListColaboradoresFilters = {
      empresaId: req.empresaId,
      status: req.status,
    }

    const user = await this.repo.findUserAuth(req.userId)
    const isAdmin = user?.role === 'ADMIN'

    if (!isAdmin) {
      let gestor = await this.repo.findGestorColaboradorByUserId(req.userId)
      if (!gestor && user?.cpf) {
        gestor = await this.repo.findGestorByCpf(user.cpf)
      }
      if (gestor) filters.gestorId = gestor.id
    }

    const colaboradores = await this.repo.listColaboradores(filters)
    return right({ colaboradores: colaboradores.map(mapColaborador) })
  }
}
