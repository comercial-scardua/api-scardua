import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import {
  type CriarTicketSuporteData,
  SuporteRepository,
} from '../repositories/suporte-repository'

type CriarComentarioResponse = Either<never, { comentario: any }>

@Injectable()
export class CriarComentarioUseCase {
  constructor(private repo: SuporteRepository) {}

  async execute(
    ticketId: string,
    data: CriarTicketSuporteData,
  ): Promise<CriarComentarioResponse> {
    const comentario = await this.repo.createComentario(ticketId, data)
    return right({ comentario })
  }
}
