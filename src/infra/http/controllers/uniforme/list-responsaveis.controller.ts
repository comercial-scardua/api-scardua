import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { ListResponsaveisUseCase } from '../../../../domain/uniforme/application/use-cases/list-responsaveis'

@ApiTags('Uniforme')
@ApiBearerAuth()
@Controller('/uniforme/responsaveis')
@UseGuards(PermissionsGuard)
export class ListResponsaveisController {
  constructor(private listResponsaveis: ListResponsaveisUseCase) {}

  @Get()
  @HttpCode(200)
  @RequirePermission('uniforme', 'access')
  @ApiOperation({ summary: 'Listar responsáveis por uniforme' })
  async handle() {
    const result = await this.listResponsaveis.execute()
    return result.value
  }
}
