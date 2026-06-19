import {
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
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
export class GetArquivoContratoController {
  constructor(private gerenciarArquivo: GerenciarArquivoContratoUseCase) {}

  @Post(':id/arquivos/:arquivoId')
  @HttpCode(200)
  @RequirePermission('contratos', 'access')
  @ApiOperation({ summary: 'Buscar arquivo específico do contrato' })
  async handle(
    @Param('id', ParseIntPipe) id: number,
    @Param('arquivoId', ParseIntPipe) arquivoId: number,
  ) {
    const result = await this.gerenciarArquivo.buscar(id, arquivoId)

    if (result.isLeft()) {
      throw new NotFoundException(
        `Arquivo #${arquivoId} não encontrado no contrato #${id}`,
      )
    }

    return { arquivo: result.value.arquivo }
  }
}
