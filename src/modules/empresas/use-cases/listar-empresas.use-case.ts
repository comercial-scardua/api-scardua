import { Injectable } from '@nestjs/common';
import type { EmpresasRepository } from '../repositories/empresas.repository';

@Injectable()
export class ListarEmpresasUseCase {
  constructor(private repo: EmpresasRepository) {}

  execute(filters: {
    searchTerm?: string;
    mostrarOcultos?: boolean;
    page?: number;
    limit?: number;
  }) {
    return this.repo.findAll(filters);
  }
}
