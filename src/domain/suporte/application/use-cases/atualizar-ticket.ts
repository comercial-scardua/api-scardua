import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import { SuporteRepository } from '../repositories/suporte-repository'

type AtualizarTicketResponse = Either<never, { ticket: any }>

@Injectable()
export class AtualizarTicketUseCase {
  constructor(private repo: SuporteRepository) {}

  async execute(
    ticketId: string,
    data: Record<string, unknown>,
  ): Promise<AtualizarTicketResponse> {
    const ticket = await this.repo.updateTicket(ticketId, data)
    return right({ ticket })
  }
}
