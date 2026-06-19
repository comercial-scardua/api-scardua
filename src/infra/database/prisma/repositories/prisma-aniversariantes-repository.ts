import { Injectable } from '@nestjs/common'
import {
  type AniversariantesRepository,
  type ColaboradorAniversariante,
} from '../../../../domain/aniversariantes/application/repositories/aniversariantes-repository'
import { PrismaService } from '../../../../prisma/prisma.service'

@Injectable()
export class PrismaAniversariantesRepository
  implements AniversariantesRepository
{
  constructor(private prisma: PrismaService) {}

  async findColaboradoresComNascimento(): Promise<ColaboradorAniversariante[]> {
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
    })

    return colaboradores.map((c) => ({
      id: c.id,
      nome: c.nome,
      sobrenome: c.sobrenome,
      // dataNascimento garantido não-nulo pelo filtro acima
      dataNascimento: c.dataNascimento as Date,
      empresa: c.empresa?.nomeEmpresa ?? null,
    }))
  }
}
