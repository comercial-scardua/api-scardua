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
import { BuscarDocumentoUseCase } from '../../../../domain/sgq/application/use-cases/buscar-documento'

@ApiTags('SGQ')
@ApiBearerAuth()
@Controller('/sgq')
@UseGuards(PermissionsGuard)
export class BuscarDocumentoController {
  constructor(private buscarDocumento: BuscarDocumentoUseCase) {}

  @Get('documents/:id')
  @HttpCode(200)
  @RequirePermission('sgq', 'access')
  @ApiOperation({ summary: 'Buscar documento SGQ por ID' })
  async handle(@Param('id', ParseIntPipe) id: number) {
    const doc = await this.buscarDocumento.execute(id)
    if (!doc) throw new NotFoundException(`Documento #${id} nao encontrado`)
    return doc
  }
}
