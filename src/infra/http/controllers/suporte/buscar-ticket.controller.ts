import {
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { BuscarTicketUseCase } from '../../../../domain/suporte/application/use-cases/buscar-ticket'

@ApiTags('Suporte')
@ApiBearerAuth()
@Controller('/suporte')
@UseGuards(PermissionsGuard)
export class BuscarTicketController {
  constructor(private buscarTicket: BuscarTicketUseCase) {}

  @Get(':id')
  @HttpCode(200)
  @RequirePermission('suporte', 'access')
  @ApiOperation({ summary: 'Buscar ticket por ticketId (todos os eventos)' })
  async handle(@Param('id') id: string) {
    const result = await this.buscarTicket.execute(id)
    const { eventos } = result.value

    if (!eventos.length) {
      throw new NotFoundException(`Ticket "${id}" não encontrado`)
    }

    return eventos
  }
}
