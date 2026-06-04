import { Injectable } from '@nestjs/common';
import {  Either, left, right } from '../../../core/either';
import  { UsuariosRepository } from '../repositories/usuarios.repository';
import { UsuarioNaoEncontradoError } from './errors/usuario-nao-encontrado.error';

type DesativarUsuarioResult = Either<UsuarioNaoEncontradoError, null>;

@Injectable()
export class DesativarUsuarioUseCase {
  constructor(private repo: UsuariosRepository) {}

  async execute(id: string): Promise<DesativarUsuarioResult> {
    const existe = await this.repo.findById(id);
    if (!existe) return left(new UsuarioNaoEncontradoError(id));

    await this.repo.softDelete(id);
    return right(null);
  }
}
