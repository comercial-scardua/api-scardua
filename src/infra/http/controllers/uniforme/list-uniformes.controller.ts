import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { ListUniformesUseCase } from '../../../../domain/uniforme/application/use-cases/list-uniformes'

@ApiTags('Uniforme')
@ApiBearerAuth()
@Controller('/uniforme/uniformes')
@UseGuards(PermissionsGuard)
export class ListUniformesController {
  constructor(private listUniformes: ListUniformesUseCase) {}

  @Get()
  @HttpCode(200)
  @RequirePermission('uniforme', 'access')
  @ApiOperation({ summary: 'Listar uniformes' })
  async handle() {
    const result = await this.listUniformes.execute()
    return result.value
  }
}
