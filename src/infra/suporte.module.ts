import { Module } from '@nestjs/common'
import { SuporteRepository } from '../domain/suporte/application/repositories/suporte-repository'
import { AtualizarTicketUseCase } from '../domain/suporte/application/use-cases/atualizar-ticket'
import { BuscarTicketUseCase } from '../domain/suporte/application/use-cases/buscar-ticket'
import { CriarComentarioUseCase } from '../domain/suporte/application/use-cases/criar-comentario'
import { CriarTicketEventoUseCase } from '../domain/suporte/application/use-cases/criar-ticket-evento'
import { ExcluirTicketUseCase } from '../domain/suporte/application/use-cases/excluir-ticket'
import { ListarComentariosUseCase } from '../domain/suporte/application/use-cases/listar-comentarios'
import { ListarTicketsUseCase } from '../domain/suporte/application/use-cases/listar-tickets'
import { ListarUltimosEventosUseCase } from '../domain/suporte/application/use-cases/listar-ultimos-eventos'
import { PrismaSuporteRepository } from './database/prisma/repositories/prisma-suporte-repository'
import { AtualizarTicketController } from './http/controllers/suporte/atualizar-ticket.controller'
import { BuscarTicketController } from './http/controllers/suporte/buscar-ticket.controller'
import { CriarComentarioController } from './http/controllers/suporte/criar-comentario.controller'
import { CriarTicketEventoController } from './http/controllers/suporte/criar-ticket-evento.controller'
import { ExcluirTicketController } from './http/controllers/suporte/excluir-ticket.controller'
import { ListarComentariosController } from './http/controllers/suporte/listar-comentarios.controller'
import { ListarTicketsController } from './http/controllers/suporte/listar-tickets.controller'
import { ListarUltimosEventosController } from './http/controllers/suporte/listar-ultimos-eventos.controller'

@Module({
  controllers: [
    ListarTicketsController,
    CriarTicketEventoController,
    ListarUltimosEventosController,
    BuscarTicketController,
    AtualizarTicketController,
    ExcluirTicketController,
    ListarComentariosController,
    CriarComentarioController,
  ],
  providers: [
    ListarTicketsUseCase,
    CriarTicketEventoUseCase,
    ListarUltimosEventosUseCase,
    BuscarTicketUseCase,
    AtualizarTicketUseCase,
    ExcluirTicketUseCase,
    ListarComentariosUseCase,
    CriarComentarioUseCase,
    { provide: SuporteRepository, useClass: PrismaSuporteRepository },
  ],
})
export class SuporteModule {}
