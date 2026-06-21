import {
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { AtualizarTicketUseCase } from '../../../../domain/suporte/application/use-cases/atualizar-ticket'

@ApiTags('Suporte')
@ApiBearerAuth()
@Controller('/suporte')
@UseGuards(PermissionsGuard)
export class AtualizarTicketController {
  constructor(private atualizarTicket: AtualizarTicketUseCase) {}

  @Put(':id')
  @HttpCode(200)
  @RequirePermission('suporte', 'edit')
  @ApiOperation({ summary: 'Atualizar último evento de um ticket' })
  async handle(
    @Param('id') id: string,
    @Body() body: Record<string, unknown>,
  ) {
    const result = await this.atualizarTicket.execute(id, body)
    return result.value
  }
}
