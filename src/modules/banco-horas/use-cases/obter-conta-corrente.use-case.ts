import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ObterContaCorrenteUseCase {
  constructor(private prisma: PrismaService) {}

  async executeTodas() {
    return this.prisma.conta_corrente_horas.findMany({
      orderBy: { funcionario_nome: 'asc' },
    });
  }

  async executePorColaborador(colaboradorId: number) {
    return this.prisma.conta_corrente_horas.findUnique({
      where: { colaborador_id: colaboradorId },
    });
  }
}
