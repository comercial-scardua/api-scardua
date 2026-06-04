import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { randomUUID } from 'crypto'
import {  Either, left, right } from '../../../core/either'
import  { CriarUsuarioDto } from '../dto/criar-usuario.dto'
import  {
  SafeUser,
  UsuariosRepository,
} from '../repositories/usuarios.repository'
import { CpfJaCadastradoError } from './errors/cpf-ja-cadastrado.error'
import { EmailJaCadastradoError } from './errors/email-ja-cadastrado.error'

type CriarUsuarioResult = Either<
  EmailJaCadastradoError | CpfJaCadastradoError,
  { usuario: SafeUser }
>

@Injectable()
export class CriarUsuarioUseCase {
  constructor(private repo: UsuariosRepository) {}

  async execute(dto: CriarUsuarioDto): Promise<CriarUsuarioResult> {
    const [emailExiste, cpfExiste] = await Promise.all([
      this.repo.findByEmail(dto.email),
      this.repo.findByCpf(dto.cpf),
    ])

    if (emailExiste) return left(new EmailJaCadastradoError(dto.email))
    if (cpfExiste) return left(new CpfJaCadastradoError(dto.cpf))

    const passwordHash = await bcrypt.hash(dto.password, 10)
    const usuario = await this.repo.create({
      ...dto,
      id: randomUUID(),
      passwordHash,
    })

    return right({ usuario })
  }
}
