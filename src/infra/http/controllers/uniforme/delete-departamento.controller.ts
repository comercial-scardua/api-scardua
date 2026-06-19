import {
  ConflictException,
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
import { DeleteDepartamentoUseCase } from '../../../../domain/uniforme/application/use-cases/delete-departamento'

@ApiTags('Uniforme')
@ApiBearerAuth()
@Controller('/uniforme/cargos')
@UseGuards(PermissionsGuard)
export class DeleteDepartamentoController {
  constructor(private deleteDepartamento: DeleteDepartamentoUseCase) {}

  @Delete(':id')
  @HttpCode(204)
  @RequirePermission('uniforme', 'edit')
  @ApiOperation({ summary: 'Excluir departamento' })
  async handle(@Param('id', ParseIntPipe) id: number) {
    const result = await this.deleteDepartamento.execute(id)

    if (result.isLeft()) {
      throw new ConflictException(result.value.message)
    }
  }
}
