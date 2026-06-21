import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { EpiRepository } from '../../../../domain/epi/application/repositories/epi-repository'

@ApiTags('EPI')
@ApiBearerAuth()
@Controller('/epi')
@UseGuards(PermissionsGuard)
export class FindCargoEpiLinksController {
  constructor(private repo: EpiRepository) {}

  @Get('cargo-epi')
  @RequirePermission('epi', 'access')
  @ApiOperation({ summary: 'Listar vínculos EPI × Cargo' })
  @ApiQuery({ name: 'cargo_id', required: false, type: Number })
  handle(@Query('cargo_id') cargoId?: string) {
    return this.repo.findCargoEpiLinks(cargoId ? Number(cargoId) : undefined)
  }
}
