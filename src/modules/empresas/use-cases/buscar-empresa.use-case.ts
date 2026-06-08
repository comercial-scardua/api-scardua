import { Injectable } from '@nestjs/common';
import { type Either, left, right } from '../../../core/either';
import { EmpresasRepository } from '../repositories/empresas.repository'
import type { EmpresaCompleta } from '../repositories/empresas.repository';
import { EmpresaNaoEncontradaError } from './errors/empresa-nao-encontrada.error';

type BuscarEmpresaResult = Either<
  EmpresaNaoEncontradaError,
  { empresa: EmpresaCompleta }
>;

@Injectable()
export class BuscarEmpresaUseCase {
  constructor(private repo: EmpresasRepository) {}

  async execute(id: number): Promise<BuscarEmpresaResult> {
    const empresa = await this.repo.findById(id);
    if (!empresa) return left(new EmpresaNaoEncontradaError(id));
    return right({ empresa });
  }
}
