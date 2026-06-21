import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
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
export class RemoveArquivoManualLegacyController {
  constructor(private gerenciarArquivo: GerenciarArquivoManualUseCase) {}

  @Get(':id/remove-arquivo')
  @HttpCode(200)
  @RequirePermission('manuais', 'edit')
  @ApiOperation({
    summary:
      'Remover arquivo do manual via query param (compatibilidade legacy)',
  })
  async handle(
    @Param('id', ParseIntPipe) id: number,
    @Query('arquivoId', ParseIntPipe) arquivoId: number,
  ) {
    if (!arquivoId) throw new BadRequestException('arquivoId é obrigatório')
    const result = await this.gerenciarArquivo.remover(id, arquivoId)

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    return { removed: true, arquivoId }
  }
}
