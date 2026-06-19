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
import { DeleteContratoUseCase } from '../../../../domain/contratos/application/use-cases/delete-contrato'

@ApiTags('Contratos')
@ApiBearerAuth()
@Controller('/contratos')
@UseGuards(PermissionsGuard)
export class DeleteContratoController {
  constructor(private deleteContrato: DeleteContratoUseCase) {}

  @Delete(':id')
  @HttpCode(204)
  @RequirePermission('contratos', 'edit')
  @ApiOperation({
    summary: 'Excluir contrato (soft delete — status = excluido)',
  })
  async handle(@Param('id', ParseIntPipe) id: number) {
    const result = await this.deleteContrato.execute({ contratoId: id })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }
  }
}
