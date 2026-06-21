import { Body, Controller, HttpCode, Post, UseGuards, UsePipes } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { OracleQueryExecuteUseCase } from '../../../../domain/oracle-query/application/use-cases/oracle-query-execute'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const oracleQueryExecuteBodySchema = z.object({
  sql: z.string().min(1),
  params: z.array(z.unknown()).optional(),
})

type OracleQueryExecuteBody = z.infer<typeof oracleQueryExecuteBodySchema>

@ApiTags('Oracle Query')
@ApiBearerAuth()
@Controller('oracle-query')
@UseGuards(PermissionsGuard)
export class OracleQueryExecuteController {
  constructor(private oracleQueryExecute: OracleQueryExecuteUseCase) {}

  @Post('execute')
  @HttpCode(200)
  @RequirePermission('oracle-query', 'edit')
  @ApiOperation({ summary: 'Executar query SQL no Oracle' })
  @UsePipes(new ZodValidationPipe(oracleQueryExecuteBodySchema))
  async handle(@Body() body: OracleQueryExecuteBody) {
    const result = await this.oracleQueryExecute.execute(body.sql, body.params ?? [])
    return result.value!
  }
}
