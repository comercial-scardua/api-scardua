import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../../core/either'
import type { UpdateUsuarioInput } from '../dtos/usuario-schema'
import {
  type SafeUser,
  UsuariosRepository,
} from '../repositories/usuarios-repository'
import { EmailJaCadastradoError } from './errors/email-ja-cadastrado.error'
import { UsuarioNaoEncontradoError } from './errors/usuario-nao-encontrado.error'

interface EditUsuarioUseCaseRequest {
  usuarioId: string
  data: UpdateUsuarioInput
}

type EditUsuarioUseCaseResponse = Either<
  UsuarioNaoEncontradoError | EmailJaCadastradoError,
  { usuario: SafeUser }
>

@Injectable()
export class EditUsuarioUseCase {
  constructor(private usuariosRepository: UsuariosRepository) {}

  async execute({
    usuarioId,
    data,
  }: EditUsuarioUseCaseRequest): Promise<EditUsuarioUseCaseResponse> {
    const existe = await this.usuariosRepository.findById(usuarioId)
    if (!existe) return left(new UsuarioNaoEncontradoError(usuarioId))

    if (data.email && data.email !== existe.email) {
      const emailEmUso = await this.usuariosRepository.findByEmail(data.email)
      if (emailEmUso) return left(new EmailJaCadastradoError(data.email))
    }

    const usuario = await this.usuariosRepository.update(usuarioId, data)
    return right({ usuario })
  }
}
