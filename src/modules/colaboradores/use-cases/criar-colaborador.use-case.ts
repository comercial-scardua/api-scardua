import { Injectable } from '@nestjs/common';
import {  Either, left, right } from '../../../core/either';
import  { CriarColaboradorDto } from '../dto/criar-colaborador.dto';
import  { ColaboradoresRepository } from '../repositories/colaboradores.repository';
import { CpfJaCadastradoError } from './errors/cpf-ja-cadastrado.error';

type CriarColaboradorResult = Either<CpfJaCadastradoError, { id: number }>;

@Injectable()
export class CriarColaboradorUseCase {
  constructor(private repo: ColaboradoresRepository) {}

  async execute(dto: CriarColaboradorDto): Promise<CriarColaboradorResult> {
    const existente = await this.repo.findByCpf(dto.cpf);
    if (existente) return left(new CpfJaCadastradoError(dto.cpf));

    const colaborador = await this.repo.create(dto);
    return right({ id: colaborador.id });
  }
}
