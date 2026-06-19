import { Injectable } from '@nestjs/common'
import { BancoHorasRepository } from '../repositories/banco-horas.repository'

@Injectable()
export class ListarRegistrosUseCase {
  constructor(private repo: BancoHorasRepository) {}

  execute(colaboradorId: number, dataInicio?: Date, dataFim?: Date) {
    return this.repo.listarRegistros(colaboradorId, dataInicio, dataFim)
  }
}
