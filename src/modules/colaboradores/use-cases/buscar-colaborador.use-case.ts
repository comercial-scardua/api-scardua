import { Injectable, NotFoundException } from '@nestjs/common';
import type { ColaboradoresRepository } from '../repositories/colaboradores.repository';

@Injectable()
export class BuscarColaboradorUseCase {
  constructor(private repo: ColaboradoresRepository) {}

  async execute(id: number) {
    const colaborador = await this.repo.findById(id);
    if (!colaborador)
      throw new NotFoundException(`Colaborador #${id} não encontrado`);
    return colaborador;
  }
}
