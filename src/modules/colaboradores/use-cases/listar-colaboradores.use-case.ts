import { Injectable } from '@nestjs/common';
import  { ColaboradoresRepository } from '../repositories/colaboradores.repository';

@Injectable()
export class ListarColaboradoresUseCase {
  constructor(private repo: ColaboradoresRepository) {}

  execute(cpf?: string, simple = false) {
    return this.repo.findAll({ cpf, simple });
  }
}
