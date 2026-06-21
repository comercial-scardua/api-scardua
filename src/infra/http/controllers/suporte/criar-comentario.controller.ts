import {
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { CriarComentarioUseCase } from '../../../../domain/suporte/application/use-cases/criar-comentario'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const criarComentarioBodySchema = z.object({
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

type CriarComentarioBody = z.infer<typeof criarComentarioBodySchema>

@ApiTags('Suporte')
@ApiBearerAuth()
@Controller('/suporte')
@UseGuards(PermissionsGuard)
export class CriarComentarioController {
  constructor(private criarComentario: CriarComentarioUseCase) {}

  @Post(':id/comentarios')
  @HttpCode(201)
  @RequirePermission('suporte', 'edit')
  @ApiOperation({ summary: 'Adicionar comentário a um ticket' })
  async handle(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(criarComentarioBodySchema))
    body: CriarComentarioBody,
  ) {
    const result = await this.criarComentario.execute(id, body)
    return result.value
  }
}
