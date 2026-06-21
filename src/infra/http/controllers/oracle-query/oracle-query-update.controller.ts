import { Body, Controller, HttpCode, Post, UseGuards, UsePipes } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { OracleQueryUpdateUseCase } from '../../../../domain/oracle-query/application/use-cases/oracle-query-update'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const oracleQueryUpdateBodySchema = z.object({
  sql: z.string().min(1),
  params: z.array(z.unknown()).optional(),
})

type OracleQueryUpdateBody = z.infer<typeof oracleQueryUpdateBodySchema>

@ApiTags('Oracle Query')
@ApiBearerAuth()
@Controller('oracle-query')
@UseGuards(PermissionsGuard)
export class OracleQueryUpdateController {
  constructor(private oracleQueryUpdate: OracleQueryUpdateUseCase) {}

  @Post('update')
  @HttpCode(200)
  @RequirePermission('oracle-query', 'edit')
  @ApiOperation({ summary: 'Executar UPDATE/INSERT/DELETE no Oracle' })
  @UsePipes(new ZodValidationPipe(oracleQueryUpdateBodySchema))
  async handle(@Body() body: OracleQueryUpdateBody) {
    const result = await this.oracleQueryUpdate.execute(body.sql, body.params ?? [])
    return result.value!
  }
}
