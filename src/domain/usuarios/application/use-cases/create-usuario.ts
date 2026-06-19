import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { randomUUID } from 'node:crypto'
import { type Either, left, right } from '../../../../core/either'
import type { CreateUsuarioInput } from '../dtos/usuario-schema'
import {
  type SafeUser,
  UsuariosRepository,
} from '../repositories/usuarios-repository'
import { CpfJaCadastradoError } from './errors/cpf-ja-cadastrado.error'
import { EmailJaCadastradoError } from './errors/email-ja-cadastrado.error'

type CreateUsuarioUseCaseResponse = Either<
  EmailJaCadastradoError | CpfJaCadastradoError,
  { usuario: SafeUser }
>

@Injectable()
export class CreateUsuarioUseCase {
  constructor(private usuariosRepository: UsuariosRepository) {}

  async execute(
    data: CreateUsuarioInput,
  ): Promise<CreateUsuarioUseCaseResponse> {
    const [emailExiste, cpfExiste] = await Promise.all([
      this.usuariosRepository.findByEmail(data.email),
      this.usuariosRepository.findByCpf(data.cpf),
    ])

    if (emailExiste) return left(new EmailJaCadastradoError(data.email))
    if (cpfExiste) return left(new CpfJaCadastradoError(data.cpf))

    const passwordHash = await bcrypt.hash(data.password, 10)
    const usuario = await this.usuariosRepository.create({
      ...data,
      id: randomUUID(),
      passwordHash,
    })

    return right({ usuario })
  }
}
