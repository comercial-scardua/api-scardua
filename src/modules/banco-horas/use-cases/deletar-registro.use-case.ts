import { Injectable } from '@nestjs/common'
import { left, right } from '../../../core/either'
import { RegistroNaoEncontradoError } from './errors/registro-nao-encontrado.error'
import { BancoHorasRepository } from '../repositories/banco-horas.repository'

@Injectable()
export class DeletarRegistroUseCase {
  constructor(private repo: BancoHorasRepository) {}

  async execute(id: number) {
    try {
      await this.repo.deletarRegistro(id)
      return right({})
    } catch (error: any) {
      if (error.message.includes('não encontrado')) {
        return left(new RegistroNaoEncontradoError(id))
      }
      throw error
    }
  }
}
