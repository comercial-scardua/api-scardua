import {
  Controller,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { ToggleStatusEpiUseCase } from '../../../../domain/epi/application/use-cases/toggle-status-epi'

@ApiTags('EPI')
@ApiBearerAuth()
@Controller('/epi')
@UseGuards(PermissionsGuard)
export class ToggleStatusEpiController {
  constructor(private toggleStatus: ToggleStatusEpiUseCase) {}

  @Patch('epis/:id/status')
  @RequirePermission('epi', 'edit')
  @ApiOperation({ summary: 'Ativar / desativar EPI' })
  async handle(@Param('id', ParseIntPipe) id: number) {
    const result = await this.toggleStatus.execute(id)
    if (result.isLeft()) throw new NotFoundException(result.value.message)
    return result.value.epi
  }
}
