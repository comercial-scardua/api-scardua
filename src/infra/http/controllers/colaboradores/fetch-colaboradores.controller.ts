import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { FetchColaboradoresUseCase } from '../../../../domain/colaboradores/application/use-cases/fetch-colaboradores'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const fetchColaboradoresQuerySchema = z.object({
  cpf: z.string().optional(),
  simple: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
})

type FetchColaboradoresQuery = z.infer<typeof fetchColaboradoresQuerySchema>

@ApiTags('Colaboradores')
@ApiBearerAuth()
@Controller('/colaboradores')
@UseGuards(PermissionsGuard)
export class FetchColaboradoresController {
  constructor(private fetchColaboradores: FetchColaboradoresUseCase) {}

  @Get()
  @HttpCode(200)
  @RequirePermission('colaboradores', 'access')
  @ApiOperation({ summary: 'Listar colaboradores' })
  @ApiQuery({ name: 'cpf', required: false })
  @ApiQuery({ name: 'simple', required: false, type: Boolean })
  async handle(
    @Query(new ZodValidationPipe(fetchColaboradoresQuerySchema))
    query: FetchColaboradoresQuery,
  ) {
    const result = await this.fetchColaboradores.execute(query)
    return { colaboradores: result.value!.colaboradores }
  }
}
