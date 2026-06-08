import { Injectable } from '@nestjs/common';
import { type Either, left, right } from '../../../core/either';
import { EmpresasRepository } from '../repositories/empresas.repository';
import { EmpresaNaoEncontradaError } from './errors/empresa-nao-encontrada.error';

type DesativarEmpresaResult = Either<EmpresaNaoEncontradaError, null>;

@Injectable()
export class DesativarEmpresaUseCase {
  constructor(private repo: EmpresasRepository) {}

  async execute(id: number): Promise<DesativarEmpresaResult> {
    const existe = await this.repo.findById(id);
    if (!existe) return left(new EmpresaNaoEncontradaError(id));

    await this.repo.softDelete(id);
    return right(null);
  }
}
