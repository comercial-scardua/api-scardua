import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { FetchErrosUseCase } from '../../../../domain/erros/application/use-cases/fetch-erros'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const fetchErrosQuerySchema = z.object({
  categoria: z.string().optional(),
  restrito: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
  search: z.string().optional(),
})

type FetchErrosQuery = z.infer<typeof fetchErrosQuerySchema>

@ApiTags('Erros')
@ApiBearerAuth()
@Controller('/erros')
@UseGuards(PermissionsGuard)
export class FetchErrosController {
  constructor(private fetchErros: FetchErrosUseCase) {}

  @Get()
  @HttpCode(200)
  @RequirePermission('erros', 'access')
  @ApiOperation({ summary: 'Listar erros e soluções ativos' })
  @ApiQuery({ name: 'categoria', required: false })
  @ApiQuery({ name: 'restrito', required: false, type: Boolean })
  @ApiQuery({ name: 'search', required: false })
  async handle(
    @Query(new ZodValidationPipe(fetchErrosQuerySchema)) query: FetchErrosQuery,
  ) {
    const result = await this.fetchErros.execute(query)
    return { erros: result.value!.erros }
  }
}
