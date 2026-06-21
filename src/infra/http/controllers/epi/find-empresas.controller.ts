import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { EpiRepository } from '../../../../domain/epi/application/repositories/epi-repository'

@ApiTags('EPI')
@ApiBearerAuth()
@Controller('/epi')
@UseGuards(PermissionsGuard)
export class FindEmpresasController {
  constructor(private repo: EpiRepository) {}

  @Get('empresas')
  @RequirePermission('epi', 'access')
  @ApiOperation({ summary: 'Listar empresas/filiais' })
  handle() {
    return this.repo.findEmpresas()
  }
}
