import {
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { DesativarManualUseCase } from '../../../../domain/manuais/application/use-cases/desativar-manual'

@ApiTags('Manuais')
@ApiBearerAuth()
@Controller('/manuais')
@UseGuards(PermissionsGuard)
export class DeleteManualController {
  constructor(private desativarManual: DesativarManualUseCase) {}

  @Delete(':id')
  @HttpCode(204)
  @RequirePermission('manuais', 'edit')
  @ApiOperation({ summary: 'Desativar manual (soft delete)' })
  async handle(@Param('id', ParseIntPipe) id: number) {
    const result = await this.desativarManual.execute({ manualId: id })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }
  }
}
