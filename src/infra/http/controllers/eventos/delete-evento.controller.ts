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
import { DeleteEventoUseCase } from '../../../../domain/eventos/application/use-cases/delete-evento'

@ApiTags('Eventos')
@ApiBearerAuth()
@Controller('/eventos')
@UseGuards(PermissionsGuard)
export class DeleteEventoController {
  constructor(private deleteEvento: DeleteEventoUseCase) {}

  @Delete(':id')
  @HttpCode(204)
  @RequirePermission('eventos', 'edit')
  @ApiOperation({ summary: 'Soft delete de evento (oculto: true)' })
  async handle(@Param('id', ParseIntPipe) id: number) {
    const result = await this.deleteEvento.execute({ eventoId: id })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }
  }
}
