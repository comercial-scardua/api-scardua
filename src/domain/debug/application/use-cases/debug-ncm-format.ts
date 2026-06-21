import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import { PrismaService } from '../../../../prisma/prisma.service'

type DebugNcmFormatResponse = Either<null, { total: number; exemplos: any[]; campos: string[] }>

@Injectable()
export class DebugNcmFormatUseCase {
  constructor(private prisma: PrismaService) {}

  async execute(): Promise<DebugNcmFormatResponse> {
    const registros = await this.prisma.ncm.findMany({ take: 5 })
    return right({
      total: await this.prisma.ncm.count(),
      exemplos: registros,
      campos: registros.length > 0 ? Object.keys(registros[0]) : [],
    })
  }
}
