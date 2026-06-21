import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import { SuporteRepository } from '../repositories/suporte-repository'

type ListarComentariosResponse = Either<never, { comentarios: any[] }>

@Injectable()
export class ListarComentariosUseCase {
  constructor(private repo: SuporteRepository) {}

  async execute(ticketId: string): Promise<ListarComentariosResponse> {
    const comentarios = await this.repo.findComentariosByTicketId(ticketId)
    return right({ comentarios })
  }
}
