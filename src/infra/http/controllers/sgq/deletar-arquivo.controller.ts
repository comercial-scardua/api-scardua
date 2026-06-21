import { Controller, Delete, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { DeletarArquivoUseCase } from '../../../../domain/sgq/application/use-cases/deletar-arquivo'

@ApiTags('SGQ')
@ApiBearerAuth()
@Controller('/sgq')
@UseGuards(PermissionsGuard)
export class DeletarArquivoController {
  constructor(private deletarArquivo: DeletarArquivoUseCase) {}

  @Delete('files')
  @HttpCode(200)
  @RequirePermission('sgq', 'edit')
  @ApiOperation({
    summary: 'Deletar arquivo SGQ (nao disponivel via API direta)',
  })
  async handle() {
    return this.deletarArquivo.execute()
  }
}
