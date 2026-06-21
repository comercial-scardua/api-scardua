import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { FinalNcmValidationUseCase } from '../../../../domain/ncm-utilities/application/use-cases/final-ncm-validation'

@ApiTags('NCM Utilities')
@ApiBearerAuth()
@Controller('')
@UseGuards(PermissionsGuard)
export class FinalNcmValidationController {
  constructor(private finalNcmValidation: FinalNcmValidationUseCase) {}

  @Get('final-ncm-validation')
  @HttpCode(200)
  @RequirePermission('ncm-utilities', 'access')
  @ApiOperation({ summary: 'Validacao final dos NCMs — verifica integridade' })
  async handle() {
    const result = await this.finalNcmValidation.execute()
    return result.value
  }
}
