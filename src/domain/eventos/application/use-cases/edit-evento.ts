import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../../core/either'
import type { Evento } from '../../enterprise/entities/evento'
import { EventoPeriodo } from '../../enterprise/value-objects/evento-periodo'
import { EventosRepository } from '../repositories/eventos-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface EditEventoUseCaseRequest {
  eventoId: number
  tipo?: string
  titulo?: string
  descricao?: string | null
  dataInicio?: Date
  dataFim?: Date | null
  empresaId?: number | null
  responsavelId?: number | null
  cor?: string | null
}

type EditEventoUseCaseResponse = Either<
  ResourceNotFoundError,
  { evento: Evento }
>

@Injectable()
export class EditEventoUseCase {
  constructor(private eventosRepository: EventosRepository) {}

  async execute({
    eventoId,
    tipo,
    titulo,
    descricao,
    dataInicio,
    dataFim,
    empresaId,
    responsavelId,
    cor,
  }: EditEventoUseCaseRequest): Promise<EditEventoUseCaseResponse> {
    const evento = await this.eventosRepository.findById(eventoId)

    if (!evento) {
      return left(new ResourceNotFoundError())
    }

    if (tipo !== undefined) evento.tipo = tipo
    if (titulo !== undefined) evento.titulo = titulo
    if (descricao !== undefined) evento.descricao = descricao
    if (empresaId !== undefined) evento.empresaId = empresaId
    if (responsavelId !== undefined) evento.responsavelId = responsavelId
    if (cor !== undefined) evento.cor = cor

    if (dataInicio !== undefined || dataFim !== undefined) {
      evento.periodo = EventoPeriodo.create({
        inicio: dataInicio ?? evento.dataInicio,
        fim: dataFim !== undefined ? dataFim : evento.dataFim,
      })
    }

    const saved = await this.eventosRepository.save(evento)

    return right({ evento: saved })
  }
}
