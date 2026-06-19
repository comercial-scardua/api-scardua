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
import { DeleteEmpresaUseCase } from '../../../../domain/empresas/application/use-cases/delete-empresa'

@ApiTags('Empresas')
@ApiBearerAuth()
@Controller('/empresas')
@UseGuards(PermissionsGuard)
export class DeleteEmpresaController {
  constructor(private deleteEmpresa: DeleteEmpresaUseCase) {}

  @Delete(':id')
  @HttpCode(204)
  @RequirePermission('empresas', 'edit')
  @ApiOperation({ summary: 'Desativar empresa (soft delete)' })
  async handle(@Param('id', ParseIntPipe) id: number) {
    const result = await this.deleteEmpresa.execute({ empresaId: id })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }
  }
}
