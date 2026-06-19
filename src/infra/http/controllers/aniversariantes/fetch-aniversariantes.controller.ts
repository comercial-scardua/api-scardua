import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { FetchAniversariantesUseCase } from '../../../../domain/aniversariantes/application/use-cases/fetch-aniversariantes'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const fetchAniversariantesQuerySchema = z.object({
  mes: z.coerce.number().int().min(1).max(12).optional(),
})

type FetchAniversariantesQuery = z.infer<typeof fetchAniversariantesQuerySchema>

@ApiTags('Aniversariantes')
@ApiBearerAuth()
@Controller('/aniversariantes')
@UseGuards(PermissionsGuard)
export class FetchAniversariantesController {
  constructor(private fetchAniversariantes: FetchAniversariantesUseCase) {}

  @Get()
  @HttpCode(200)
  @RequirePermission('aniversariantes', 'access')
  @ApiOperation({
    summary:
      'Listar aniversariantes do mês (padrão: mês atual; use ?mes=1-12 para outro mês)',
  })
  @ApiQuery({ name: 'mes', required: false, type: Number })
  async handle(
    @Query(new ZodValidationPipe(fetchAniversariantesQuerySchema))
    query: FetchAniversariantesQuery,
  ) {
    const result = await this.fetchAniversariantes.execute(query.mes)
    return { aniversariantes: result.value!.aniversariantes }
  }
}
