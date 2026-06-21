import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import { PrismaService } from '../../../../prisma/prisma.service'

type TestBatch50Response = Either<null, { batchSize: number; retornados: number; totalDisponivel: number; data: any[] }>

@Injectable()
export class TestBatch50UseCase {
  constructor(private prisma: PrismaService) {}

  async execute(): Promise<TestBatch50Response> {
    const [ncms, total] = await Promise.all([
      this.prisma.ncm.findMany({ take: 50, orderBy: { id: 'asc' } }),
      this.prisma.ncm.count(),
    ])
    return right({ batchSize: 50, retornados: ncms.length, totalDisponivel: total, data: ncms })
  }
}
