import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { ListEmpresasUseCase } from '../../../../domain/uniforme/application/use-cases/list-empresas'

@ApiTags('Uniforme')
@ApiBearerAuth()
@Controller('/uniforme/empresas')
@UseGuards(PermissionsGuard)
export class ListEmpresasUniformeController {
  constructor(private listEmpresas: ListEmpresasUseCase) {}

  @Get()
  @HttpCode(200)
  @RequirePermission('uniforme', 'access')
  @ApiOperation({ summary: 'Listar empresas disponíveis para uniforme' })
  async handle() {
    const result = await this.listEmpresas.execute()
    return result.value
  }
}
