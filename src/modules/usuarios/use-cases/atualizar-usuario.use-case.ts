import { Injectable } from '@nestjs/common';
import {  Either, left, right } from '../../../core/either';
import  { AtualizarUsuarioDto } from '../dto/atualizar-usuario.dto';
import  { SafeUser, UsuariosRepository } from '../repositories/usuarios.repository';
import { EmailJaCadastradoError } from './errors/email-ja-cadastrado.error';
import { UsuarioNaoEncontradoError } from './errors/usuario-nao-encontrado.error';

type AtualizarUsuarioResult = Either<
  UsuarioNaoEncontradoError | EmailJaCadastradoError,
  { usuario: SafeUser }
>;

@Injectable()
export class AtualizarUsuarioUseCase {
  constructor(private repo: UsuariosRepository) {}

  async execute(
    id: string,
    dto: AtualizarUsuarioDto,
  ): Promise<AtualizarUsuarioResult> {
    const existe = await this.repo.findById(id);
    if (!existe) return left(new UsuarioNaoEncontradoError(id));

    if (dto.email && dto.email !== existe.email) {
      const emailEmUso = await this.repo.findByEmail(dto.email);
      if (emailEmUso) return left(new EmailJaCadastradoError(dto.email));
    }

    const usuario = await this.repo.update(id, dto);
    return right({ usuario });
  }
}
