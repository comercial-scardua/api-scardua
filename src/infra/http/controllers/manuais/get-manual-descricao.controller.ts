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
export class GetManualDescricaoController {
  constructor(private buscarManual: BuscarManualUseCase) {}

  @Get(':id/descricao')
  @HttpCode(200)
  @RequirePermission('manuais', 'access')
  @ApiOperation({
    summary: 'Retorna apenas a descricao do manual (campo LONGTEXT isolado)',
  })
  async handle(@Param('id', ParseIntPipe) id: number) {
    const result = await this.buscarManual.execute({ manualId: id })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    return { id, descricao: result.value.manual.descricao }
  }
}
