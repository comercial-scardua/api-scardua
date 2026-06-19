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
import { DeleteRelatorioUseCase } from '../../../../domain/relatorios/application/use-cases/delete-relatorio'

@ApiTags('Relatorios')
@ApiBearerAuth()
@Controller('/relatorios')
@UseGuards(PermissionsGuard)
export class DeleteRelatorioController {
  constructor(private deleteRelatorio: DeleteRelatorioUseCase) {}

  @Delete(':id')
  @HttpCode(204)
  @RequirePermission('relatorios', 'edit')
  @ApiOperation({ summary: 'Excluir relatorio (soft delete — ativo: false)' })
  async handle(@Param('id', ParseIntPipe) id: number) {
    const result = await this.deleteRelatorio.execute({ relatorioId: id })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }
  }
}
