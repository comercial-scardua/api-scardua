import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import { PrismaService } from '../../../../prisma/prisma.service'

type DebugPermissionsResponse = Either<null, { total: number; permissions: any[] }>

@Injectable()
export class DebugPermissionsUseCase {
  constructor(private prisma: PrismaService) {}

  async execute(): Promise<DebugPermissionsResponse> {
    const permissions = await this.prisma.permission.findMany({
      orderBy: [{ userId: 'asc' }, { page: 'asc' }],
    })
    return right({ total: permissions.length, permissions })
  }
}
