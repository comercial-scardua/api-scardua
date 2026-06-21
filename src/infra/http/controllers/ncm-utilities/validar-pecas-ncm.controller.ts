import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { ValidarPecasNcmUseCase } from '../../../../domain/ncm-utilities/application/use-cases/validar-pecas-ncm'

@ApiTags('NCM Utilities')
@ApiBearerAuth()
@Controller('')
@UseGuards(PermissionsGuard)
export class ValidarPecasNcmController {
  constructor(private validarPecasNcm: ValidarPecasNcmUseCase) {}

  @Get('validar-pecas-ncm')
  @HttpCode(200)
  @RequirePermission('ncm-utilities', 'access')
  @ApiOperation({ summary: 'Validar pecas por NCM — produtos sem NCM valido' })
  async handle() {
    const result = await this.validarPecasNcm.execute()
    return result.value
  }
}
