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
import { DeleteColaboradorUseCase } from '../../../../domain/colaboradores/application/use-cases/delete-colaborador'

@ApiTags('Colaboradores')
@ApiBearerAuth()
@Controller('/colaboradores')
@UseGuards(PermissionsGuard)
export class DeleteColaboradorController {
  constructor(private deleteColaborador: DeleteColaboradorUseCase) {}

  @Delete(':id')
  @HttpCode(204)
  @RequirePermission('colaboradores', 'edit')
  @ApiOperation({ summary: 'Desativar colaborador (soft delete)' })
  async handle(@Param('id', ParseIntPipe) id: number) {
    const result = await this.deleteColaborador.execute({ colaboradorId: id })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }
  }
}
