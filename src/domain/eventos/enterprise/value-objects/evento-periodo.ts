import { ValueObject } from '../../../../core/entities/value-object'

export interface EventoPeriodoProps {
  inicio: Date
  fim?: Date | null
}

/**
 * Período de um evento (data de início e fim opcional).
 */
export class EventoPeriodo extends ValueObject<EventoPeriodoProps> {
  get inicio() {
    return this.props.inicio
  }

  get fim() {
    return this.props.fim ?? null
  }

  /** Indica se o evento já se encerrou (quando há data fim definida). */
  get encerrado(): boolean {
    return this.props.fim ? this.props.fim.getTime() < Date.now() : false
  }

  static create(props: EventoPeriodoProps) {
    return new EventoPeriodo({
      inicio: props.inicio,
      fim: props.fim ?? null,
    })
  }
}
