import { Injectable } from '@nestjs/common';
import { left, right } from '../../../core/either';
import type { RegistrarPontoDto } from '../dto/registrar-ponto.dto';
import { RegistroNaoEncontradoError } from './errors/registro-nao-encontrado.error';
import { BancoHorasRepository } from '../repositories/banco-horas.repository';

@Injectable()
export class AtualizarRegistroUseCase {
  constructor(private repo: BancoHorasRepository) {}

  async execute(id: number, dto: Partial<RegistrarPontoDto>) {
    try {
      const registro = await this.repo.atualizarRegistro(id, dto);
      return right({ registro });
    } catch (error: any) {
      if (error.message.includes('não encontrado')) {
        return left(new RegistroNaoEncontradoError(id));
      }
      throw error;
    }
  }
}
