import { Injectable } from '@nestjs/common'
import { Either, left, right } from '../../../core/either'
import {
  SafeUser,
  UsuariosRepository,
} from '../repositories/usuarios.repository'
import { UsuarioNaoEncontradoError } from './errors/usuario-nao-encontrado.error'

type BuscarUsuarioResult = Either<
  UsuarioNaoEncontradoError,
  { usuario: SafeUser }
>

@Injectable()
export class BuscarUsuarioUseCase {
  constructor(private repo: UsuariosRepository) {}

  async execute(id: string): Promise<BuscarUsuarioResult> {
    const usuario = await this.repo.findById(id)
    if (!usuario) return left(new UsuarioNaoEncontradoError(id))
    return right({ usuario })
  }
}
