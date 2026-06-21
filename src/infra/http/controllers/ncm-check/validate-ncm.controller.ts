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
import { ValidateNcmUseCase } from '../../../../domain/ncm-check/application/use-cases/validate-ncm'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const validateNcmSchema = z.object({
  ncm: z.string(),
})

type ValidateNcmBody = z.infer<typeof validateNcmSchema>

@ApiTags('NCM Check')
@ApiBearerAuth()
@Controller('/ncm-check')
@UseGuards(PermissionsGuard)
export class ValidateNcmController {
  constructor(private validateNcm: ValidateNcmUseCase) {}

  @Post()
  @HttpCode(200)
  @RequirePermission('ncm-check', 'access')
  @UsePipes(new ZodValidationPipe(validateNcmSchema))
  @ApiOperation({ summary: 'Validar um NCM' })
  async handle(@Body() body: ValidateNcmBody) {
    const result = await this.validateNcm.execute({ ncm: body.ncm })
    return result.value
  }
}
