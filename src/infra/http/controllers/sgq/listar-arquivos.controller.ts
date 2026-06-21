import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { ListarArquivosUseCase } from '../../../../domain/sgq/application/use-cases/listar-arquivos'

@ApiTags('SGQ')
@ApiBearerAuth()
@Controller('/sgq')
@UseGuards(PermissionsGuard)
export class ListarArquivosController {
  constructor(private listarArquivos: ListarArquivosUseCase) {}

  @Get('files')
  @HttpCode(200)
  @RequirePermission('sgq', 'access')
  @ApiOperation({ summary: 'Listar arquivos anexados aos documentos SGQ' })
  async handle() {
    return this.listarArquivos.execute()
  }
}
