import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { FetchEventosUseCase } from '../../../../domain/eventos/application/use-cases/fetch-eventos'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { EventoPresenter } from '../../presenters/evento-presenter'

const fetchEventosQuerySchema = z.object({
  mes: z.coerce.number().int().optional(),
  ano: z.coerce.number().int().optional(),
  tipo: z.string().optional(),
  empresaId: z.coerce.number().int().optional(),
  oculto: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
})

type FetchEventosQuery = z.infer<typeof fetchEventosQuerySchema>

@ApiTags('Eventos')
@ApiBearerAuth()
@Controller('/eventos')
@UseGuards(PermissionsGuard)
export class FetchEventosController {
  constructor(private fetchEventos: FetchEventosUseCase) {}

  @Get()
  @HttpCode(200)
  @RequirePermission('eventos', 'access')
  @ApiOperation({ summary: 'Listar eventos' })
  @ApiQuery({ name: 'mes', required: false, type: Number })
  @ApiQuery({ name: 'ano', required: false, type: Number })
  @ApiQuery({ name: 'tipo', required: false })
  @ApiQuery({ name: 'empresaId', required: false, type: Number })
  @ApiQuery({ name: 'oculto', required: false, type: Boolean })
  async handle(
    @Query(new ZodValidationPipe(fetchEventosQuerySchema))
    query: FetchEventosQuery,
  ) {
    const result = await this.fetchEventos.execute(query)

    return { eventos: result.value!.eventos.map(EventoPresenter.toHTTP) }
  }
}
