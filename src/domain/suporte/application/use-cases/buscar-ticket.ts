import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import { SuporteRepository } from '../repositories/suporte-repository'

type BuscarTicketResponse = Either<never, { eventos: any[] }>

@Injectable()
export class BuscarTicketUseCase {
  constructor(private repo: SuporteRepository) {}

  async execute(ticketId: string): Promise<BuscarTicketResponse> {
    const eventos = await this.repo.findTicketById(ticketId)
    return right({ eventos })
  }
}
