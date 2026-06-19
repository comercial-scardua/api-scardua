import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../../core/either'
import {
  type SafeUser,
  UsuariosRepository,
} from '../repositories/usuarios-repository'
import { UsuarioNaoEncontradoError } from './errors/usuario-nao-encontrado.error'

interface GetUsuarioUseCaseRequest {
  usuarioId: string
}

type GetUsuarioUseCaseResponse = Either<
  UsuarioNaoEncontradoError,
  { usuario: SafeUser }
>

@Injectable()
export class GetUsuarioUseCase {
  constructor(private usuariosRepository: UsuariosRepository) {}

  async execute({
    usuarioId,
  }: GetUsuarioUseCaseRequest): Promise<GetUsuarioUseCaseResponse> {
    const usuario = await this.usuariosRepository.findById(usuarioId)
    if (!usuario) return left(new UsuarioNaoEncontradoError(usuarioId))
    return right({ usuario })
  }
}
