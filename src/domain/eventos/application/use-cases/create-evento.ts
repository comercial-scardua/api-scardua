import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import { Evento } from '../../enterprise/entities/evento'
import { EventoPeriodo } from '../../enterprise/value-objects/evento-periodo'
import { EventosRepository } from '../repositories/eventos-repository'

interface CreateEventoUseCaseRequest {
  tipo: string
  titulo: string
  descricao?: string | null
  dataInicio: Date
  dataFim?: Date | null
  empresaId?: number | null
  responsavelId?: number | null
  cor?: string | null
  criadoPorId: string
}

type CreateEventoUseCaseResponse = Either<null, { evento: Evento }>

@Injectable()
export class CreateEventoUseCase {
  constructor(private eventosRepository: EventosRepository) {}

  async execute({
    tipo,
    titulo,
    descricao,
    dataInicio,
    dataFim,
    empresaId,
    responsavelId,
    cor,
    criadoPorId,
  }: CreateEventoUseCaseRequest): Promise<CreateEventoUseCaseResponse> {
    const evento = Evento.create({
      tipo,
      titulo,
      descricao,
      periodo: EventoPeriodo.create({ inicio: dataInicio, fim: dataFim }),
      empresaId,
      responsavelId,
      cor,
      criadoPorId,
    })

    const created = await this.eventosRepository.create(evento)

    return right({ evento: created })
  }
}
