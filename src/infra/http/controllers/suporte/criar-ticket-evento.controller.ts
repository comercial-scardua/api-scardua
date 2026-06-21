import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { CriarTicketEventoUseCase } from '../../../../domain/suporte/application/use-cases/criar-ticket-evento'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const criarTicketSuporteBodySchema = z.object({
  ticketId: z.string().min(1),
  tipoEvento: z.enum([
    'CRIACAO',
    'ATRIBUICAO',
    'MUDANCA_STATUS',
    'MUDANCA_PRIORIDADE',
    'COMENTARIO_PUBLICO',
    'NOTA_INTERNA',
    'ANEXO_ADICIONADO',
    'RESOLUCAO',
    'FECHAMENTO',
    'REABERTURA',
  ]),
  descricao: z.string().min(1),
  autorNome: z.string().optional(),
  autorEmail: z.string().email().optional(),
})

type CriarTicketSuporteBody = z.infer<typeof criarTicketSuporteBodySchema>

@ApiTags('Suporte')
@ApiBearerAuth()
@Controller('/suporte')
@UseGuards(PermissionsGuard)
export class CriarTicketEventoController {
  constructor(private criarTicketEvento: CriarTicketEventoUseCase) {}

  @Post()
  @HttpCode(201)
  @RequirePermission('suporte', 'edit')
  @ApiOperation({ summary: 'Criar novo evento de ticket' })
  @UsePipes(new ZodValidationPipe(criarTicketSuporteBodySchema))
  async handle(@Body() body: CriarTicketSuporteBody) {
    const result = await this.criarTicketEvento.execute(body)
    return result.value
  }
}
