import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { ListCargoUniformeUseCase } from '../../../../domain/uniforme/application/use-cases/list-cargo-uniforme'

@ApiTags('Uniforme')
@ApiBearerAuth()
@Controller('/uniforme/cargo-uniforme')
@UseGuards(PermissionsGuard)
export class ListCargoUniformeController {
  constructor(private listCargoUniforme: ListCargoUniformeUseCase) {}

  @Get()
  @HttpCode(200)
  @RequirePermission('uniforme', 'access')
  @ApiOperation({ summary: 'Listar vínculos cargo-uniforme' })
  async handle() {
    const result = await this.listCargoUniforme.execute()
    return result.value
  }
}
