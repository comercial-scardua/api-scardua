import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { ListDepartamentosUseCase } from '../../../../domain/uniforme/application/use-cases/list-departamentos'

@ApiTags('Uniforme')
@ApiBearerAuth()
@Controller('/uniforme/cargos')
@UseGuards(PermissionsGuard)
export class ListDepartamentosController {
  constructor(private listDepartamentos: ListDepartamentosUseCase) {}

  @Get()
  @HttpCode(200)
  @RequirePermission('uniforme', 'access')
  @ApiOperation({ summary: 'Listar departamentos (cargos de uniforme)' })
  async handle() {
    const result = await this.listDepartamentos.execute()
    return result.value
  }
}
