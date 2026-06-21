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
import { DesativarNcmUseCase } from '../../../../domain/ncm/application/use-cases/desativar-ncm'

@ApiTags('NCM')
@ApiBearerAuth()
@Controller('/ncm')
@UseGuards(PermissionsGuard)
export class DesativarNcmController {
  constructor(private desativarNcm: DesativarNcmUseCase) {}

  @Delete(':id')
  @HttpCode(204)
  @RequirePermission('ncm', 'edit')
  @ApiOperation({ summary: 'Desativar NCM (soft delete)' })
  async handle(@Param('id', ParseIntPipe) id: number) {
    const result = await this.desativarNcm.execute(id)

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }
  }
}
