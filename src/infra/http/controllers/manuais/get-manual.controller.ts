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
export class GetManualController {
  constructor(private buscarManual: BuscarManualUseCase) {}

  @Get(':id')
  @HttpCode(200)
  @RequirePermission('manuais', 'access')
  @ApiOperation({ summary: 'Buscar manual por ID (com descricao e arquivos)' })
  async handle(@Param('id', ParseIntPipe) id: number) {
    const result = await this.buscarManual.execute({ manualId: id })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    return result.value.manual
  }
}
