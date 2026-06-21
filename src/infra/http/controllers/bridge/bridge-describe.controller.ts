import { Body, Controller, HttpCode, Post, UseGuards, UsePipes } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { BridgeDescribeUseCase } from '../../../../domain/bridge/application/use-cases/bridge-describe'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const bridgeDescribeBodySchema = z.object({
  tableName: z.string().min(1),
})

type BridgeDescribeBody = z.infer<typeof bridgeDescribeBodySchema>

@ApiTags('Bridge')
@ApiBearerAuth()
@Controller('bridge')
@UseGuards(PermissionsGuard)
export class BridgeDescribeController {
  constructor(private bridgeDescribe: BridgeDescribeUseCase) {}

  @Post('describe')
  @HttpCode(200)
  @RequirePermission('bridge', 'access')
  @ApiOperation({ summary: 'Descrever estrutura de uma tabela via Bridge' })
  @UsePipes(new ZodValidationPipe(bridgeDescribeBodySchema))
  async handle(@Body() body: BridgeDescribeBody) {
    const result = await this.bridgeDescribe.execute(body.tableName)
    return result.value!
  }
}
