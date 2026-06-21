import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import { PrismaService } from '../../../../prisma/prisma.service'

type Test52NcmsResponse = Either<null, { total: number; solicitado: number; data: any[] }>

@Injectable()
export class Test52NcmsUseCase {
  constructor(private prisma: PrismaService) {}

  async execute(): Promise<Test52NcmsResponse> {
    const data = await this.prisma.ncm.findMany({
      take: 52,
      orderBy: { id: 'asc' },
    })
    return right({ total: data.length, solicitado: 52, data })
  }
}
