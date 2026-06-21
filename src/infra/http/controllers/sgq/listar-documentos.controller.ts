import {
  Controller,
  Get,
  HttpCode,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { ListarDocumentosUseCase } from '../../../../domain/sgq/application/use-cases/listar-documentos'

@ApiTags('SGQ')
@ApiBearerAuth()
@Controller('/sgq')
@UseGuards(PermissionsGuard)
export class ListarDocumentosController {
  constructor(private listarDocumentos: ListarDocumentosUseCase) {}

  @Get('documents')
  @HttpCode(200)
  @RequirePermission('sgq', 'access')
  @ApiOperation({ summary: 'Listar documentos SGQ' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'processId', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false })
  async handle(
    @Query('status') status?: string,
    @Query('type') type?: string,
    @Query('processId', new ParseIntPipe({ optional: true }))
    processId?: number,
    @Query('search') search?: string,
  ) {
    return this.listarDocumentos.execute({
      filters: { status, type, processId, search },
    })
  }
}
