import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { EpiRepository } from '../../../../domain/epi/application/repositories/epi-repository'

@ApiTags('EPI')
@ApiBearerAuth()
@Controller('/epi')
@UseGuards(PermissionsGuard)
export class GetEpiController {
  constructor(private repo: EpiRepository) {}

  @Get('epis/:id')
  @RequirePermission('epi', 'access')
  @ApiOperation({ summary: 'Buscar EPI por ID com histórico' })
  async handle(@Param('id', ParseIntPipe) id: number) {
    const epi = await this.repo.findEpiById(id)
    if (!epi) throw new NotFoundException(`EPI ${id} não encontrado`)
    return epi
  }
}
