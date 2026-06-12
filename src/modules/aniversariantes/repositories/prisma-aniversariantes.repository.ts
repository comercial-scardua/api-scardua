import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import type {
  AniversariantesRepository,
  ColaboradorAniversariante,
} from './aniversariantes.repository';

@Injectable()
export class PrismaAniversariantesRepository
  implements AniversariantesRepository
{
  constructor(private prisma: PrismaService) {}

  async findColaboradoresComNascimento(): Promise<
    ColaboradorAniversariante[]
  > {
    const colaboradores = await this.prisma.colaboradores.findMany({
      where: {
        dataNascimento: { not: null },
        oculto: false,
      },
      select: {
        id: true,
        nome: true,
        sobrenome: true,
        dataNascimento: true,
        empresa: { select: { nomeEmpresa: true } },
      },
    });

    return colaboradores.map((c) => ({
      id: c.id,
      nome: c.nome,
      sobrenome: c.sobrenome,
      dataNascimento: c.dataNascimento!,
      empresa: c.empresa?.nomeEmpresa ?? null,
    }));
  }
}
