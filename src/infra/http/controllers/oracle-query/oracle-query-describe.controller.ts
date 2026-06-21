import { Body, Controller, HttpCode, Post, UseGuards, UsePipes } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { OracleQueryDescribeUseCase } from '../../../../domain/oracle-query/application/use-cases/oracle-query-describe'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const oracleQueryDescribeBodySchema = z.object({
  tableName: z.string().min(1),
})

type OracleQueryDescribeBody = z.infer<typeof oracleQueryDescribeBodySchema>

@ApiTags('Oracle Query')
@ApiBearerAuth()
@Controller('oracle-query')
@UseGuards(PermissionsGuard)
export class OracleQueryDescribeController {
  constructor(private oracleQueryDescribe: OracleQueryDescribeUseCase) {}

  @Post('describe')
  @HttpCode(200)
  @RequirePermission('oracle-query', 'access')
  @ApiOperation({ summary: 'Descrever estrutura de uma tabela Oracle' })
  @UsePipes(new ZodValidationPipe(oracleQueryDescribeBodySchema))
  async handle(@Body() body: OracleQueryDescribeBody) {
    const result = await this.oracleQueryDescribe.execute(body.tableName)
    return result.value!
  }
}
