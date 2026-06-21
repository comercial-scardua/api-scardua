import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import { SuporteRepository } from '../repositories/suporte-repository'

type ListarTicketsResponse = Either<never, { tickets: any[] }>

@Injectable()
export class ListarTicketsUseCase {
  constructor(private repo: SuporteRepository) {}

  async execute(): Promise<ListarTicketsResponse> {
    const tickets = await this.repo.findAllTickets()
    return right({ tickets })
  }
}
