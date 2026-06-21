import { Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { UploadArquivoUseCase } from '../../../../domain/sgq/application/use-cases/upload-arquivo'

@ApiTags('SGQ')
@ApiBearerAuth()
@Controller('/sgq')
@UseGuards(PermissionsGuard)
export class UploadArquivoController {
  constructor(private uploadArquivo: UploadArquivoUseCase) {}

  @Post('files')
  @HttpCode(200)
  @RequirePermission('sgq', 'edit')
  @ApiOperation({
    summary: 'Operacao de arquivo SGQ (nao disponivel via API direta)',
  })
  async handle() {
    return this.uploadArquivo.execute()
  }
}
