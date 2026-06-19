import { Injectable } from '@nestjs/common'
import { BancoHorasRepository } from '../repositories/banco-horas.repository'

@Injectable()
export class ListarSaldosUseCase {
  constructor(private repo: BancoHorasRepository) {}

  execute() {
    return this.repo.listarSaldosPorColaborador()
  }
}
