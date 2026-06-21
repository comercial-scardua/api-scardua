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
import { GerenciarArquivoManualUseCase } from '../../../../domain/manuais/application/use-cases/gerenciar-arquivo-manual'

@ApiTags('Manuais')
@ApiBearerAuth()
@Controller('/manuais')
@UseGuards(PermissionsGuard)
export class RemoveArquivoManualController {
  constructor(private gerenciarArquivo: GerenciarArquivoManualUseCase) {}

  @Delete(':id/arquivos/:arquivoId')
  @HttpCode(204)
  @RequirePermission('manuais', 'edit')
  @ApiOperation({ summary: 'Remover arquivo do manual' })
  async handle(
    @Param('id', ParseIntPipe) id: number,
    @Param('arquivoId', ParseIntPipe) arquivoId: number,
  ) {
    const result = await this.gerenciarArquivo.remover(id, arquivoId)

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }
  }
}
