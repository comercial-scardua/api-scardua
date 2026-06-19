import { Prisma, type eventos as PrismaEvento } from '@prisma/client'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'
import { Evento } from '../../../../domain/eventos/enterprise/entities/evento'
import { EventoPeriodo } from '../../../../domain/eventos/enterprise/value-objects/evento-periodo'

export class PrismaEventoMapper {
  static toDomain(raw: PrismaEvento): Evento {
    return Evento.create(
      {
        tipo: raw.tipo,
        titulo: raw.titulo,
        descricao: raw.descricao,
        periodo: EventoPeriodo.create({
          inicio: raw.dataInicio,
          fim: raw.dataFim,
        }),
        empresaId: raw.empresaId,
        responsavelId: raw.responsavelId,
        cor: raw.cor,
        criadoPorId: raw.criadoPorId,
        oculto: raw.oculto,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(String(raw.id)),
    )
  }

  static toPrismaCreate(evento: Evento): Prisma.eventosUncheckedCreateInput {
    return {
      tipo: evento.tipo,
      titulo: evento.titulo,
      descricao: evento.descricao,
      dataInicio: evento.dataInicio,
      dataFim: evento.dataFim,
      empresaId: evento.empresaId,
      responsavelId: evento.responsavelId,
      cor: evento.cor,
      criadoPorId: evento.criadoPorId,
      oculto: evento.oculto,
      updatedAt: new Date(),
    }
  }

  static toPrismaUpdate(evento: Evento): Prisma.eventosUncheckedUpdateInput {
    return {
      tipo: evento.tipo,
      titulo: evento.titulo,
      descricao: evento.descricao,
      dataInicio: evento.dataInicio,
      dataFim: evento.dataFim,
      empresaId: evento.empresaId,
      responsavelId: evento.responsavelId,
      cor: evento.cor,
      oculto: evento.oculto,
      updatedAt: new Date(),
    }
  }
}
