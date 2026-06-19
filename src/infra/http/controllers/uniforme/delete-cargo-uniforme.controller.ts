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
import { DeleteCargoUniformeUseCase } from '../../../../domain/uniforme/application/use-cases/delete-cargo-uniforme'

@ApiTags('Uniforme')
@ApiBearerAuth()
@Controller('/uniforme/cargo-uniforme')
@UseGuards(PermissionsGuard)
export class DeleteCargoUniformeController {
  constructor(private deleteCargoUniforme: DeleteCargoUniformeUseCase) {}

  @Delete(':id')
  @HttpCode(204)
  @RequirePermission('uniforme', 'edit')
  @ApiOperation({ summary: 'Remover vínculo cargo-uniforme' })
  async handle(@Param('id', ParseIntPipe) id: number) {
    await this.deleteCargoUniforme.execute(id)
  }
}
