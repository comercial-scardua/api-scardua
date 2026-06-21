import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { ExecuteOracleQueryUseCase } from '../../../../domain/oracle-test/application/use-cases/execute-oracle-query'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const executeOracleQueryBodySchema = z.object({
  sql: z.string().optional(),
  params: z.array(z.unknown()).optional(),
})

type ExecuteOracleQueryBody = z.infer<typeof executeOracleQueryBodySchema>

@ApiTags('Oracle Test')
@ApiBearerAuth()
@Controller('oracle-test')
@UseGuards(PermissionsGuard)
export class ExecuteOracleQueryController {
  constructor(private executeOracleQuery: ExecuteOracleQueryUseCase) {}

  @Post()
  @HttpCode(200)
  @RequirePermission('oracle-test', 'edit')
  @ApiOperation({ summary: 'Executar teste de query simples no Oracle' })
  async handle(
    @Body(new ZodValidationPipe(executeOracleQueryBodySchema))
    body: ExecuteOracleQueryBody,
  ) {
    const result = await this.executeOracleQuery.execute(body)
    return result.value
  }
}
