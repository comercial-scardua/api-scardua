import { Entity } from '../../../../core/entities/entity'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'
import type { Optional } from '../../../../core/types/optional'
import { EventoPeriodo } from '../value-objects/evento-periodo'

export interface EventoProps {
  tipo: string
  titulo: string
  descricao?: string | null
  periodo: EventoPeriodo
  empresaId?: number | null
  responsavelId?: number | null
  cor?: string | null
  criadoPorId?: string | null
  oculto: boolean
  createdAt: Date
  updatedAt?: Date | null
}

export class Evento extends Entity<EventoProps> {
  get tipo() {
    return this.props.tipo
  }

  set tipo(value: string) {
    this.props.tipo = value
    this.touch()
  }

  get titulo() {
    return this.props.titulo
  }

  set titulo(value: string) {
    this.props.titulo = value
    this.touch()
  }

  get descricao() {
    return this.props.descricao ?? null
  }

  set descricao(value: string | null) {
    this.props.descricao = value
    this.touch()
  }

  get periodo() {
    return this.props.periodo
  }

  set periodo(value: EventoPeriodo) {
    this.props.periodo = value
    this.touch()
  }

  get dataInicio() {
    return this.props.periodo.inicio
  }

  get dataFim() {
    return this.props.periodo.fim
  }

  get empresaId() {
    return this.props.empresaId ?? null
  }

  set empresaId(value: number | null) {
    this.props.empresaId = value
    this.touch()
  }

  get responsavelId() {
    return this.props.responsavelId ?? null
  }

  set responsavelId(value: number | null) {
    this.props.responsavelId = value
    this.touch()
  }

  get cor() {
    return this.props.cor ?? null
  }

  set cor(value: string | null) {
    this.props.cor = value
    this.touch()
  }

  get criadoPorId() {
    return this.props.criadoPorId ?? null
  }

  get oculto() {
    return this.props.oculto
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt ?? null
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  /** Soft delete: marca o evento como oculto. */
  ocultar() {
    this.props.oculto = true
    this.touch()
  }

  static create(
    props: Optional<EventoProps, 'oculto' | 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    return new Evento(
      {
        ...props,
        oculto: props.oculto ?? false,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }
}
