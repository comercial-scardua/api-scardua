import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { FetchMovimentacoesUseCase } from '../../../../domain/movimentacao/application/use-cases/fetch-movimentacoes'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const fetchMovimentacoesQuerySchema = z.object({
  patrimonioId: z.coerce.number().int().optional(),
  tipo: z.string().optional(),
  dataInicio: z.string().optional(),
  dataFim: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
})

type FetchMovimentacoesQuery = z.infer<typeof fetchMovimentacoesQuerySchema>

@ApiTags('Movimentação')
@ApiBearerAuth()
@Controller('/movimentacao')
@UseGuards(PermissionsGuard)
export class FetchMovimentacoesController {
  constructor(private fetchMovimentacoes: FetchMovimentacoesUseCase) {}

  @Get()
  @HttpCode(200)
  @RequirePermission('movimentacao', 'access')
  @ApiOperation({ summary: 'Listar movimentações com filtros e paginação' })
  @ApiQuery({ name: 'patrimonioId', required: false, type: Number })
  @ApiQuery({ name: 'tipo', required: false })
  @ApiQuery({ name: 'dataInicio', required: false })
  @ApiQuery({ name: 'dataFim', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async handle(
    @Query(new ZodValidationPipe(fetchMovimentacoesQuerySchema))
    query: FetchMovimentacoesQuery,
  ) {
    const result = await this.fetchMovimentacoes.execute(query)
    return result.value!
  }
}
