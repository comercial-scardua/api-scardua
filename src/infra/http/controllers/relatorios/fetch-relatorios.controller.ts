import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { FetchRelatoriosUseCase } from '../../../../domain/relatorios/application/use-cases/fetch-relatorios'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const fetchRelatoriosQuerySchema = z.object({
  departamento: z.string().optional(),
  restrito: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
  search: z.string().optional(),
})

type FetchRelatoriosQuery = z.infer<typeof fetchRelatoriosQuerySchema>

@ApiTags('Relatorios')
@ApiBearerAuth()
@Controller('/relatorios')
@UseGuards(PermissionsGuard)
export class FetchRelatoriosController {
  constructor(private fetchRelatorios: FetchRelatoriosUseCase) {}

  @Get()
  @HttpCode(200)
  @RequirePermission('relatorios', 'access')
  @ApiOperation({ summary: 'Listar relatorios ativos' })
  @ApiQuery({ name: 'departamento', required: false })
  @ApiQuery({ name: 'restrito', required: false, type: Boolean })
  @ApiQuery({ name: 'search', required: false })
  async handle(
    @Query(new ZodValidationPipe(fetchRelatoriosQuerySchema))
    query: FetchRelatoriosQuery,
  ) {
    const result = await this.fetchRelatorios.execute(query)
    return { relatorios: result.value!.relatorios }
  }
}
