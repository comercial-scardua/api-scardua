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
import { GerenciarArquivoContratoUseCase } from '../../../../domain/contratos/application/use-cases/gerenciar-arquivo-contrato'

@ApiTags('Contratos')
@ApiBearerAuth()
@Controller('/contratos')
@UseGuards(PermissionsGuard)
export class RemoveArquivoContratoController {
  constructor(private gerenciarArquivo: GerenciarArquivoContratoUseCase) {}

  @Delete(':id/arquivos/:arquivoId')
  @HttpCode(204)
  @RequirePermission('contratos', 'edit')
  @ApiOperation({ summary: 'Remover arquivo do contrato' })
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
