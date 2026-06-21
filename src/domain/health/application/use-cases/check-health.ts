import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../../core/either'
import { PrismaService } from '../../../../prisma/prisma.service'

interface HealthyResponse {
  status: string
  database: string
  timestamp: string
}

interface UnhealthyResponse {
  status: string
  database: string
  error: string
  timestamp: string
}

type CheckHealthUseCaseResponse = Either<UnhealthyResponse, HealthyResponse>

@Injectable()
export class CheckHealthUseCase {
  constructor(private prisma: PrismaService) {}

  async execute(): Promise<CheckHealthUseCaseResponse> {
    const timestamp = new Date().toISOString()
    try {
      await this.prisma.$queryRaw`SELECT 1`
      return right({
        status: 'healthy',
        database: 'connected',
        timestamp,
      })
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error'
      return left({
        status: 'unhealthy',
        database: 'disconnected',
        error: msg,
        timestamp,
      })
    }
  }
}
