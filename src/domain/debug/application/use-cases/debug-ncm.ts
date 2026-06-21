import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import { PrismaService } from '../../../../prisma/prisma.service'

type DebugNcmResponse = Either<null, { total: number; amostra: any[] }>

@Injectable()
export class DebugNcmUseCase {
  constructor(private prisma: PrismaService) {}

  async execute(): Promise<DebugNcmResponse> {
    const total = await this.prisma.ncm.count()
    const amostra = await this.prisma.ncm.findMany({ take: 10 })
    return right({ total, amostra })
  }
}
