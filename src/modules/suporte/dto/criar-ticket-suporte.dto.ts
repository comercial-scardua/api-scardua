import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const CriarTicketSuporteSchema = z.object({
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

export class CriarTicketSuporteDto extends createZodDto(CriarTicketSuporteSchema) {}
