import { Injectable } from '@nestjs/common';
import {  Either, left, right } from '../../../core/either';
import  { ColaboradoresRepository } from '../repositories/colaboradores.repository';
import { ColaboradorNaoEncontradoError } from './errors/colaborador-nao-encontrado.error';

type DesativarColaboradorResult = Either<ColaboradorNaoEncontradoError, null>;

@Injectable()
export class DesativarColaboradorUseCase {
  constructor(private repo: ColaboradoresRepository) {}

  async execute(id: number): Promise<DesativarColaboradorResult> {
    const existe = await this.repo.findById(id);
    if (!existe) return left(new ColaboradorNaoEncontradoError(id));

    await this.repo.softDelete(id);
    return right(null);
  }
}
