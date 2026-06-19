import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { FetchPatrimoniosUseCase } from '../../../../domain/patrimonios/application/use-cases/fetch-patrimonios'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const fetchPatrimoniosQuerySchema = z.object({
  showHidden: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
})

type FetchPatrimoniosQuery = z.infer<typeof fetchPatrimoniosQuerySchema>

@ApiTags('Patrimônios')
@ApiBearerAuth()
@Controller('/patrimonio')
@UseGuards(PermissionsGuard)
export class FetchPatrimoniosController {
  constructor(private fetchPatrimonios: FetchPatrimoniosUseCase) {}

  @Get()
  @HttpCode(200)
  @RequirePermission('patrimonio', 'access')
  @ApiOperation({ summary: 'Listar patrimônios' })
  @ApiQuery({ name: 'showHidden', required: false, type: Boolean })
  async handle(
    @Query(new ZodValidationPipe(fetchPatrimoniosQuerySchema))
    query: FetchPatrimoniosQuery,
  ) {
    const result = await this.fetchPatrimonios.execute(query.showHidden)
    return { patrimonios: result.value!.patrimonios }
  }
}
