import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import { PrismaService } from '../../../../prisma/prisma.service'

type DebugUsuariosResponse = Either<null, { total: number; porRole: { role: string; quantidade: number }[] }>

@Injectable()
export class DebugUsuariosUseCase {
  constructor(private prisma: PrismaService) {}

  async execute(): Promise<DebugUsuariosResponse> {
    const total = await this.prisma.users.count()
    const porRole = await this.prisma.users.groupBy({
      by: ['role'],
      _count: { id: true },
    })
    return right({
      total,
      porRole: porRole.map((r) => ({ role: r.role, quantidade: r._count.id })),
    })
  }
}
