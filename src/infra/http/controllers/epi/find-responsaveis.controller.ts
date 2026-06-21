import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { EpiRepository } from '../../../../domain/epi/application/repositories/epi-repository'

@ApiTags('EPI')
@ApiBearerAuth()
@Controller('/epi')
@UseGuards(PermissionsGuard)
export class FindResponsaveisController {
  constructor(private repo: EpiRepository) {}

  @Get('responsaveis')
  @RequirePermission('epi', 'access')
  @ApiOperation({ summary: 'Listar usuários responsáveis pelo EPI' })
  handle() {
    return this.repo.findResponsaveis()
  }
}
