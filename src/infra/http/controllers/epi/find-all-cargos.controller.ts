import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { EpiRepository } from '../../../../domain/epi/application/repositories/epi-repository'

@ApiTags('EPI')
@ApiBearerAuth()
@Controller('/epi')
@UseGuards(PermissionsGuard)
export class FindAllCargosController {
  constructor(private repo: EpiRepository) {}

  @Get('cargos')
  @RequirePermission('epi', 'access')
  @ApiOperation({ summary: 'Listar cargos com contagens' })
  handle() {
    return this.repo.findAllCargos()
  }
}
