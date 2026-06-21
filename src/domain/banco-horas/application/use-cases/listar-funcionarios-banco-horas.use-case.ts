import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../../prisma/prisma.service'

@Injectable()
export class ListarFuncionariosBancoHorasUseCase {
  constructor(private prisma: PrismaService) {}

  async execute() {
    const colaboradores = await this.prisma.colaboradores.findMany({
      where: { oculto: false },
      include: { contaCorrenteHoras: true },
      orderBy: { nome: 'asc' },
    })

    return colaboradores.map((c) => ({
      id: c.id,
      nome: `${c.nome} ${c.sobrenome}`.trim(),
      cpf: c.cpf,
      cargo: c.cargo,
      email: c.email,
      saldo: c.contaCorrenteHoras ? Number(c.contaCorrenteHoras.saldo) : 0,
    }))
  }
}
