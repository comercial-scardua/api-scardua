import { Injectable } from '@nestjs/common'
import type { NcmCheckRepository } from '../../../../domain/ncm-check/application/repositories/ncm-check-repository'
import { PrismaService } from '../../../../prisma/prisma.service'

@Injectable()
export class PrismaNcmCheckRepository implements NcmCheckRepository {
  constructor(private prisma: PrismaService) {}

  async findByCodigoPrefix(codigo: string) {
    return this.prisma.ncm.findFirst({
      where: { codigo_ncm: { startsWith: codigo } },
    })
  }
}
