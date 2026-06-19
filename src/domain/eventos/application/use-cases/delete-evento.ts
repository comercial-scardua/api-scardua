import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../../core/either'
import { EventosRepository } from '../repositories/eventos-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface DeleteEventoUseCaseRequest {
  eventoId: number
}

type DeleteEventoUseCaseResponse = Either<ResourceNotFoundError, null>

@Injectable()
export class DeleteEventoUseCase {
  constructor(private eventosRepository: EventosRepository) {}

  async execute({
    eventoId,
  }: DeleteEventoUseCaseRequest): Promise<DeleteEventoUseCaseResponse> {
    const evento = await this.eventosRepository.findById(eventoId)

    if (!evento) {
      return left(new ResourceNotFoundError())
    }

    // Soft delete (oculto: true), preservando o histórico.
    evento.ocultar()
    await this.eventosRepository.save(evento)

    return right(null)
  }
}
