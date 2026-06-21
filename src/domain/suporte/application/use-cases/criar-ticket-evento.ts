import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import {
  type CriarTicketSuporteData,
  SuporteRepository,
} from '../repositories/suporte-repository'

type CriarTicketEventoResponse = Either<never, { evento: any }>

@Injectable()
export class CriarTicketEventoUseCase {
  constructor(private repo: SuporteRepository) {}

  async execute(
    data: CriarTicketSuporteData,
  ): Promise<CriarTicketEventoResponse> {
    const evento = await this.repo.createTicketEvento(data)
    return right({ evento })
  }
}
