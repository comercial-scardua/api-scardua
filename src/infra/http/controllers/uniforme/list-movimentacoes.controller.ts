import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { ListMovimentacoesUseCase } from '../../../../domain/uniforme/application/use-cases/list-movimentacoes'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const listMovimentacoesQuerySchema = z.object({
  colaborador_id: z.coerce.number().int().positive().optional(),
  uniforme_id: z.coerce.number().int().positive().optional(),
  tipo: z.enum(['ENTREGA', 'DEVOLUCAO', 'TROCA', 'PERDA', 'BAIXA']).optional(),
  empresaId: z.coerce.number().int().positive().optional(),
})

type ListMovimentacoesQuery = z.infer<typeof listMovimentacoesQuerySchema>

@ApiTags('Uniforme')
@ApiBearerAuth()
@Controller('/uniforme/movimentacoes')
@UseGuards(PermissionsGuard)
export class ListMovimentacoesController {
  constructor(private listMovimentacoes: ListMovimentacoesUseCase) {}

  @Get()
  @HttpCode(200)
  @RequirePermission('uniforme', 'access')
  @ApiOperation({ summary: 'Listar movimentações de uniforme' })
  @ApiQuery({ name: 'colaborador_id', required: false, type: Number })
  @ApiQuery({ name: 'uniforme_id', required: false, type: Number })
  @ApiQuery({ name: 'tipo', required: false })
  @ApiQuery({ name: 'empresaId', required: false, type: Number })
  async handle(
    @Query(new ZodValidationPipe(listMovimentacoesQuerySchema))
    query: ListMovimentacoesQuery,
  ) {
    const result = await this.listMovimentacoes.execute({
      colaboradorId: query.colaborador_id,
      uniformeId: query.uniforme_id,
      tipo: query.tipo,
      empresaId: query.empresaId,
    })
    return result.value
  }
}
