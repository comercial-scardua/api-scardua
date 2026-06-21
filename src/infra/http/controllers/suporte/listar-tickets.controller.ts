import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { ListarTicketsUseCase } from '../../../../domain/suporte/application/use-cases/listar-tickets'

@ApiTags('Suporte')
@ApiBearerAuth()
@Controller('/suporte')
@UseGuards(PermissionsGuard)
export class ListarTicketsController {
  constructor(private listarTickets: ListarTicketsUseCase) {}

  @Get()
  @HttpCode(200)
  @RequirePermission('suporte', 'access')
  @ApiOperation({
    summary: 'Listar histórico de tickets agrupado por ticketId',
  })
  async handle() {
    const result = await this.listarTickets.execute()
    return result.value
  }
}
