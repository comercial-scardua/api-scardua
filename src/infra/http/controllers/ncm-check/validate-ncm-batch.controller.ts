import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { ValidateNcmBatchUseCase } from '../../../../domain/ncm-check/application/use-cases/validate-ncm-batch'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const validateNcmBatchSchema = z.object({
  ncms: z.array(z.string()),
})

type ValidateNcmBatchBody = z.infer<typeof validateNcmBatchSchema>

@ApiTags('NCM Check')
@ApiBearerAuth()
@Controller('/ncm-check')
@UseGuards(PermissionsGuard)
export class ValidateNcmBatchController {
  constructor(private validateNcmBatch: ValidateNcmBatchUseCase) {}

  @Post('batch')
  @HttpCode(200)
  @RequirePermission('ncm-check', 'access')
  @UsePipes(new ZodValidationPipe(validateNcmBatchSchema))
  @ApiOperation({ summary: 'Validar múltiplos NCMs' })
  async handle(@Body() body: ValidateNcmBatchBody) {
    const result = await this.validateNcmBatch.execute({ ncms: body.ncms })
    return result.value
  }
}
