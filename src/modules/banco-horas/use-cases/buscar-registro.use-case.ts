import { Injectable } from '@nestjs/common'
import { left, right } from '../../../core/either'
import { RegistroNaoEncontradoError } from './errors/registro-nao-encontrado.error'
import { BancoHorasRepository } from '../repositories/banco-horas.repository'

@Injectable()
export class BuscarRegistroUseCase {
  constructor(private repo: BancoHorasRepository) {}

  async execute(id: number) {
    const registro = await this.repo.buscarRegistro(id)

    if (!registro) {
      return left(new RegistroNaoEncontradoError(id))
    }

    return right({ registro })
  }
}
