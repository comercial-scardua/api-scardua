import { Injectable } from '@nestjs/common';
import { left, right } from '../../../core/either';
import type { registros_banco_horas } from '@prisma/client';
import type { RegistrarPontoDto } from '../dto/registrar-ponto.dto';
import { ColaboradorNaoEncontradoBancoHorasError } from './errors/colaborador-nao-encontrado.error';
import { BancoHorasRepository } from '../repositories/banco-horas.repository';

@Injectable()
export class RegistrarPontoUseCase {
  constructor(private repo: BancoHorasRepository) {}

  async execute(dto: RegistrarPontoDto) {
    try {
      const registro = await this.repo.criarRegistro(dto);
      return right({ registro });
    } catch (error: any) {
      if (error.message.includes('não encontrado')) {
        return left(new ColaboradorNaoEncontradoBancoHorasError(dto.colaboradorId));
      }
      throw error;
    }
  }
}
