import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { RunReportQueryUseCase } from '../../../../domain/reports/application/use-cases/run-report-query'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const runReportQueryBodySchema = z.object({
  relatorioId: z.number().int().optional(),
  sql: z.string().optional(),
  parametros: z.record(z.string(), z.unknown()).optional(),
})

type RunReportQueryBody = z.infer<typeof runReportQueryBodySchema>

@ApiTags('Reports')
@ApiBearerAuth()
@Controller('reports')
@UseGuards(PermissionsGuard)
export class RunReportQueryController {
  constructor(private runReportQuery: RunReportQueryUseCase) {}

  @Post('run-query')
  @HttpCode(200)
  @RequirePermission('reports', 'access')
  @ApiOperation({ summary: 'Executar query de relatório via Oracle bridge' })
  async handle(
    @Body(new ZodValidationPipe(runReportQueryBodySchema))
    body: RunReportQueryBody,
  ) {
    const result = await this.runReportQuery.execute(body)
    return result.value
  }
}
