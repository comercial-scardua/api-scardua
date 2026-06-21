import { Injectable } from '@nestjs/common'
import { left, right } from '../../../../core/either'
import type { RegistrarPontoData } from '../repositories/banco-horas-repository'
import { BancoHorasRepository } from '../repositories/banco-horas-repository'
import { RegistroNaoEncontradoError } from './errors/registro-nao-encontrado.error'

@Injectable()
export class AtualizarRegistroUseCase {
  constructor(private repo: BancoHorasRepository) {}

  async execute(id: number, dto: Partial<RegistrarPontoData>) {
    try {
      const registro = await this.repo.atualizarRegistro(id, dto)
      return right({ registro })
    } catch (error: any) {
      if (error.message.includes('não encontrado')) {
        return left(new RegistroNaoEncontradoError(id))
      }
      throw error
    }
  }
}
