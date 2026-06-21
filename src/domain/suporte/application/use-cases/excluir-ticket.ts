import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import { SuporteRepository } from '../repositories/suporte-repository'

type ExcluirTicketResponse = Either<never, null>

@Injectable()
export class ExcluirTicketUseCase {
  constructor(private repo: SuporteRepository) {}

  async execute(ticketId: string): Promise<ExcluirTicketResponse> {
    await this.repo.deleteTicket(ticketId)
    return right(null)
  }
}
