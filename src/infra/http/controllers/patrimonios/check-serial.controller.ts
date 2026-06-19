import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { CheckPatrimonioSerialUseCase } from '../../../../domain/patrimonios/application/use-cases/check-patrimonio-serial'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const checkSerialQuerySchema = z.object({
  serial: z.string(),
  skipId: z.coerce.number().int().optional(),
})

type CheckSerialQuery = z.infer<typeof checkSerialQuerySchema>

@ApiTags('Patrimônios')
@ApiBearerAuth()
@Controller('/patrimonio')
@UseGuards(PermissionsGuard)
export class CheckSerialController {
  constructor(private checkSerial: CheckPatrimonioSerialUseCase) {}

  @Get('check-serial')
  @HttpCode(200)
  @ApiOperation({ summary: 'Verificar se número de série já existe' })
  @ApiQuery({ name: 'serial', required: true })
  @ApiQuery({ name: 'skipId', required: false, type: Number })
  async handle(
    @Query(new ZodValidationPipe(checkSerialQuerySchema))
    query: CheckSerialQuery,
  ) {
    const result = await this.checkSerial.execute(query)
    return result.value!
  }
}
