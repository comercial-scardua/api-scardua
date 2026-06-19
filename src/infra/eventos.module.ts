import { Module } from '@nestjs/common'
import { EventosRepository } from '../domain/eventos/application/repositories/eventos-repository'
import { CreateEventoUseCase } from '../domain/eventos/application/use-cases/create-evento'
import { DeleteEventoUseCase } from '../domain/eventos/application/use-cases/delete-evento'
import { EditEventoUseCase } from '../domain/eventos/application/use-cases/edit-evento'
import { FetchEventosUseCase } from '../domain/eventos/application/use-cases/fetch-eventos'
import { PrismaEventosRepository } from './database/prisma/repositories/prisma-eventos-repository'
import { CreateEventoController } from './http/controllers/eventos/create-evento.controller'
import { DeleteEventoController } from './http/controllers/eventos/delete-evento.controller'
import { EditEventoController } from './http/controllers/eventos/edit-evento.controller'
import { FetchEventosController } from './http/controllers/eventos/fetch-eventos.controller'

/**
 * Módulo de Eventos no padrão DDD/Clean Architecture (template de referência):
 * - HTTP: 1 controller por caso de uso (infra/http/controllers/eventos)
 * - Aplicação: use-cases retornando Either (domain/eventos/application)
 * - Domínio: entidade Evento + value-object EventoPeriodo (domain/eventos/enterprise)
 * - Persistência: PrismaEventosRepository + mapper (infra/database/prisma)
 *
 * PrismaService é fornecido globalmente pelo PrismaModule (@Global).
 */
@Module({
  controllers: [
    CreateEventoController,
    EditEventoController,
    DeleteEventoController,
    FetchEventosController,
  ],
  providers: [
    CreateEventoUseCase,
    EditEventoUseCase,
    DeleteEventoUseCase,
    FetchEventosUseCase,
    { provide: EventosRepository, useClass: PrismaEventosRepository },
  ],
})
export class EventosModule {}
