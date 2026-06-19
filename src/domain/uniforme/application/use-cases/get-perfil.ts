import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import { UniformeRepository } from '../repositories/uniforme-repository'

export interface PerfilDTO {
  isAdmin: boolean
  isGestor: boolean
  colaboradorId: number | null
  empresaIds: number[]
  empresasGestor: { id: number; nomeEmpresa: string }[]
}

const EMPTY: PerfilDTO = {
  isAdmin: false,
  isGestor: false,
  colaboradorId: null,
  empresaIds: [],
  empresasGestor: [],
}

type GetPerfilResponse = Either<never, { perfil: PerfilDTO }>

@Injectable()
export class GetPerfilUseCase {
  constructor(private repo: UniformeRepository) {}

  async execute(userId: string): Promise<GetPerfilResponse> {
    const user = await this.repo.findUserAuth(userId)

    if (user?.role === 'ADMIN') {
      return right({ perfil: { ...EMPTY, isAdmin: true } })
    }

    let colaborador = await this.repo.findColaboradorByUserId(userId)
    if (!colaborador && user?.cpf) {
      colaborador = await this.repo.findGestorByCpf(user.cpf)
    }

    if (!colaborador) return right({ perfil: EMPTY })

    const gestorEmpresas = await this.repo.listGestorEmpresas(colaborador.id)

    return right({
      perfil: {
        isAdmin: false,
        isGestor: colaborador.isGestor,
        colaboradorId: colaborador.id,
        empresaIds: gestorEmpresas.map((ge) => ge.empresaId),
        empresasGestor: gestorEmpresas.map((ge) => ({
          id: ge.empresaId,
          nomeEmpresa: ge.empresa.nomeEmpresa,
        })),
      },
    })
  }
}
