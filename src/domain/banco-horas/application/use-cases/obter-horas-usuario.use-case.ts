import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../../../prisma/prisma.service'

@Injectable()
export class ObterHorasUsuarioUseCase {
  constructor(private prisma: PrismaService) {}

  async execute(userId: string) {
    const colaborador = await this.prisma.colaboradores.findFirst({
      where: { userId, oculto: false },
      select: {
        id: true,
        nome: true,
        sobrenome: true,
        cpf: true,
        cargo: true,
        setor: true,
        email: true,
      },
    })

    if (!colaborador) {
      throw new NotFoundException(
        'Colaborador não encontrado para o usuário logado',
      )
    }

    const [registros, conta] = await Promise.all([
      this.prisma.registros_banco_horas.findMany({
        where: { colaborador_id: colaborador.id },
        orderBy: { data: 'desc' },
        take: 30,
      }),
      this.prisma.conta_corrente_horas.findUnique({
        where: { colaborador_id: colaborador.id },
      }),
    ])

    return { colaborador, registros, conta }
  }
}
