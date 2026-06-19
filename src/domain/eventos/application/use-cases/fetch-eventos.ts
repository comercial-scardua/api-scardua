import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import type { Evento } from '../../enterprise/entities/evento'
import { EventosRepository } from '../repositories/eventos-repository'

interface FetchEventosUseCaseRequest {
  mes?: number
  ano?: number
  tipo?: string
  empresaId?: number
  oculto?: boolean
}

type FetchEventosUseCaseResponse = Either<null, { eventos: Evento[] }>

@Injectable()
export class FetchEventosUseCase {
  constructor(private eventosRepository: EventosRepository) {}

  async execute(
    filters: FetchEventosUseCaseRequest,
  ): Promise<FetchEventosUseCaseResponse> {
    const eventos = await this.eventosRepository.findMany(filters)

    return right({ eventos })
  }
}
