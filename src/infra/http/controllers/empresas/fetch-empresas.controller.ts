import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { FetchEmpresasUseCase } from '../../../../domain/empresas/application/use-cases/fetch-empresas'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const fetchEmpresasQuerySchema = z.object({
  searchTerm: z.string().optional(),
  mostrarOcultos: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
})

type FetchEmpresasQuery = z.infer<typeof fetchEmpresasQuerySchema>

@ApiTags('Empresas')
@ApiBearerAuth()
@Controller('/empresas')
@UseGuards(PermissionsGuard)
export class FetchEmpresasController {
  constructor(private fetchEmpresas: FetchEmpresasUseCase) {}

  @Get()
  @HttpCode(200)
  @RequirePermission('empresas', 'access')
  @ApiOperation({ summary: 'Listar empresas com paginação e busca' })
  @ApiQuery({ name: 'searchTerm', required: false })
  @ApiQuery({ name: 'mostrarOcultos', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async handle(
    @Query(new ZodValidationPipe(fetchEmpresasQuerySchema))
    query: FetchEmpresasQuery,
  ) {
    const result = await this.fetchEmpresas.execute(query)
    return result.value!
  }
}
