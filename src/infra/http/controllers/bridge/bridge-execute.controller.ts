import { Body, Controller, HttpCode, Post, UseGuards, UsePipes } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { BridgeExecuteUseCase } from '../../../../domain/bridge/application/use-cases/bridge-execute'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const bridgeExecuteBodySchema = z.object({
  sql: z.string().min(1),
  params: z.array(z.unknown()).optional(),
})

type BridgeExecuteBody = z.infer<typeof bridgeExecuteBodySchema>

@ApiTags('Bridge')
@ApiBearerAuth()
@Controller('bridge')
@UseGuards(PermissionsGuard)
export class BridgeExecuteController {
  constructor(private bridgeExecute: BridgeExecuteUseCase) {}

  @Post('execute')
  @HttpCode(200)
  @RequirePermission('bridge', 'edit')
  @ApiOperation({ summary: 'Executar query SQL via Bridge' })
  @UsePipes(new ZodValidationPipe(bridgeExecuteBodySchema))
  async handle(@Body() body: BridgeExecuteBody) {
    const result = await this.bridgeExecute.execute(body.sql, body.params ?? [])
    return result.value!
  }
}
