import { Injectable } from '@nestjs/common';
import {  Either, left, right } from '../../../core/either';
import  { CriarColaboradorDto } from '../dto/criar-colaborador.dto';
import  { ColaboradoresRepository } from '../repositories/colaboradores.repository';
import { ColaboradorNaoEncontradoError } from './errors/colaborador-nao-encontrado.error';

type AtualizarColaboradorResult = Either<
  ColaboradorNaoEncontradoError,
  { colaborador: Awaited<ReturnType<ColaboradoresRepository['update']>> }
>;

@Injectable()
export class AtualizarColaboradorUseCase {
  constructor(private repo: ColaboradoresRepository) {}

  async execute(
    id: number,
    dto: Partial<CriarColaboradorDto>,
  ): Promise<AtualizarColaboradorResult> {
    const existe = await this.repo.findById(id);
    if (!existe) return left(new ColaboradorNaoEncontradoError(id));

    const colaborador = await this.repo.update(id, dto);
    return right({ colaborador });
  }
}
