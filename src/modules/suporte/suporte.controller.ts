import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../auth/guards/permissions.guard'
import type { CriarTicketSuporteDto } from './dto/criar-ticket-suporte.dto'
import { SuporteRepository } from './repositories/suporte.repository'

@ApiTags('Suporte')
@ApiBearerAuth()
@Controller('suporte')
@UseGuards(PermissionsGuard)
export class SuporteController {
  constructor(private repo: SuporteRepository) {}

  @Get()
  @HttpCode(200)
  @RequirePermission('suporte', 'access')
  @ApiOperation({ summary: 'Listar histórico de tickets agrupado por ticketId' })
  async listTickets() {
    return this.repo.findAllTickets()
  }

  @Post()
  @HttpCode(201)
  @RequirePermission('suporte', 'edit')
  @ApiOperation({ summary: 'Criar novo evento de ticket' })
  async createTicketEvento(@Body() dto: CriarTicketSuporteDto) {
    return this.repo.createTicketEvento(dto)
  }

  @Get('comentarios/novos')
  @HttpCode(200)
  @RequirePermission('suporte', 'access')
  @ApiOperation({ summary: 'Listar últimos 20 eventos de todos os tickets' })
  async getUltimosEventos() {
    return this.repo.findUltimosEventos()
  }

  @Get(':id')
  @HttpCode(200)
  @RequirePermission('suporte', 'access')
  @ApiOperation({ summary: 'Buscar ticket por ticketId (todos os eventos)' })
  async findTicket(@Param('id') id: string) {
    const eventos = await this.repo.findTicketById(id)
    if (!eventos.length) {
      throw new NotFoundException(`Ticket "${id}" não encontrado`)
    }
    return eventos
  }

  @Get(':id/comentarios')
  @HttpCode(200)
  @RequirePermission('suporte', 'access')
  @ApiOperation({ summary: 'Listar comentários de um ticket' })
  async getComentarios(@Param('id') id: string) {
    return this.repo.findComentariosByTicketId(id)
  }
}
