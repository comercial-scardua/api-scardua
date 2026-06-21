import {
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { BuscarManualUseCase } from '../../../../domain/manuais/application/use-cases/buscar-manual'

@ApiTags('Manuais')
@ApiBearerAuth()
@Controller('/manuais')
@UseGuards(PermissionsGuard)
export class GetArquivoManualController {
  constructor(private buscarManual: BuscarManualUseCase) {}

  @Get(':id/Arquivos/:arquivoId')
  @HttpCode(200)
  @RequirePermission('manuais', 'access')
  @ApiOperation({ summary: 'Buscar arquivo específico do manual' })
  async handle(
    @Param('id', ParseIntPipe) id: number,
    @Param('arquivoId', ParseIntPipe) arquivoId: number,
  ) {
    const result = await this.buscarManual.execute({ manualId: id })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    const arquivo = (result.value.manual as any).arquivos?.find(
      (a: any) => a.id === arquivoId,
    )
    if (!arquivo)
      throw new NotFoundException(
        `Arquivo #${arquivoId} não encontrado no manual #${id}`,
      )
    return arquivo
  }
}
