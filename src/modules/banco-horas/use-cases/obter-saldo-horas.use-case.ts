import { Injectable } from '@nestjs/common'
import { BancoHorasRepository } from '../repositories/banco-horas.repository'

@Injectable()
export class ObterSaldoHorasUseCase {
  constructor(private repo: BancoHorasRepository) {}

  async execute(colaboradorId: number) {
    return this.repo.obterSaldoHoras(colaboradorId)
  }
}
