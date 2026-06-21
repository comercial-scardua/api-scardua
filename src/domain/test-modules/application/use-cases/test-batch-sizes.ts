import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import { PrismaService } from '../../../../prisma/prisma.service'

type TestBatchSizesResponse = Either<null, { totalDisponivel: number; resultados: any[] }>

@Injectable()
export class TestBatchSizesUseCase {
  constructor(private prisma: PrismaService) {}

  async execute(): Promise<TestBatchSizesResponse> {
    const total = await this.prisma.ncm.count()
    const sizes = [10, 25, 50, 100]

    const results = await Promise.all(
      sizes.map(async (size) => {
        const start = Date.now()
        const data = await this.prisma.ncm.findMany({
          take: size,
          orderBy: { id: 'asc' },
        })
        const elapsed = Date.now() - start
        return { batchSize: size, retornados: data.length, tempoMs: elapsed }
      }),
    )

    return right({ totalDisponivel: total, resultados: results })
  }
}
