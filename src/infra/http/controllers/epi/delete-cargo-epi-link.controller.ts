import {
  Controller,
  Delete,
  HttpCode,
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
export class DeleteCargoEpiLinkController {
  constructor(private repo: EpiRepository) {}

  @Delete('cargo-epi/:id')
  @HttpCode(204)
  @RequirePermission('epi', 'edit')
  @ApiOperation({ summary: 'Remover vínculo EPI × Cargo por ID' })
  handle(@Param('id', ParseIntPipe) id: number) {
    return this.repo.deleteCargoEpiLink(id)
  }
}
