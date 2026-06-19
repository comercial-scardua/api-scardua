import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../../core/either'
import { UsuariosRepository } from '../repositories/usuarios-repository'
import { UsuarioNaoEncontradoError } from './errors/usuario-nao-encontrado.error'

interface DeleteUsuarioUseCaseRequest {
  usuarioId: string
}

type DeleteUsuarioUseCaseResponse = Either<UsuarioNaoEncontradoError, null>

@Injectable()
export class DeleteUsuarioUseCase {
  constructor(private usuariosRepository: UsuariosRepository) {}

  async execute({
    usuarioId,
  }: DeleteUsuarioUseCaseRequest): Promise<DeleteUsuarioUseCaseResponse> {
    const existe = await this.usuariosRepository.findById(usuarioId)
    if (!existe) return left(new UsuarioNaoEncontradoError(usuarioId))

    await this.usuariosRepository.softDelete(usuarioId)
    return right(null)
  }
}
