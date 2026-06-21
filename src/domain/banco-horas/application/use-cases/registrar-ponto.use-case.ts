import { Injectable } from '@nestjs/common'
import { left, right } from '../../../../core/either'
import type { RegistrarPontoData } from '../repositories/banco-horas-repository'
import { BancoHorasRepository } from '../repositories/banco-horas-repository'
import { ColaboradorNaoEncontradoBancoHorasError } from './errors/colaborador-nao-encontrado.error'

@Injectable()
export class RegistrarPontoUseCase {
  constructor(private repo: BancoHorasRepository) {}

  async execute(dto: RegistrarPontoData) {
    try {
      const registro = await this.repo.criarRegistro(dto)
      return right({ registro })
    } catch (error: any) {
      if (error.message.includes('não encontrado')) {
        return left(
          new ColaboradorNaoEncontradoBancoHorasError(dto.colaboradorId),
        )
      }
      throw error
    }
  }
}
