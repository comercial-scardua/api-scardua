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
export class GetCargoController {
  constructor(private repo: EpiRepository) {}

  @Get('cargos/:id')
  @RequirePermission('epi', 'access')
  @ApiOperation({ summary: 'Buscar cargo por ID' })
  async handle(@Param('id', ParseIntPipe) id: number) {
    const cargo = await this.repo.findCargoById(id)
    if (!cargo) throw new NotFoundException(`Cargo ${id} não encontrado`)
    return cargo
  }
}
