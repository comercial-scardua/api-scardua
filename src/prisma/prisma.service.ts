import { Injectable, Logger, type OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name)

  async onModuleInit() {
    try {
      await this.$connect()
      this.logger.log('Banco de dados conectado')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      this.logger.warn(
        `Banco indisponível no boot — conexão será tentada na primeira query. (${message})`,
      )
    }
  }
}
