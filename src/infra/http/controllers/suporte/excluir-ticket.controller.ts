import {
  Controller,
  Delete,
  HttpCode,
  Param,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { ExcluirTicketUseCase } from '../../../../domain/suporte/application/use-cases/excluir-ticket'

@ApiTags('Suporte')
@ApiBearerAuth()
@Controller('/suporte')
@UseGuards(PermissionsGuard)
export class ExcluirTicketController {
  constructor(private excluirTicket: ExcluirTicketUseCase) {}

  @Delete(':id')
  @HttpCode(200)
  @RequirePermission('suporte', 'edit')
  @ApiOperation({ summary: 'Excluir todos os eventos de um ticket' })
  async handle(@Param('id') id: string) {
    await this.excluirTicket.execute(id)
    return { success: true, message: `Ticket "${id}" excluído` }
  }
}
