import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import {
  type SafeUser,
  UsuariosRepository,
} from '../repositories/usuarios-repository'

interface ListUsuariosUseCaseRequest {
  setor?: string
  role?: string
  oculto?: boolean
}

type ListUsuariosUseCaseResponse = Either<null, { usuarios: SafeUser[] }>

@Injectable()
export class ListUsuariosUseCase {
  constructor(private usuariosRepository: UsuariosRepository) {}

  async execute(
    filters: ListUsuariosUseCaseRequest,
  ): Promise<ListUsuariosUseCaseResponse> {
    const usuarios = await this.usuariosRepository.findAll(filters)
    return right({ usuarios })
  }
}
