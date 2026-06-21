import {
  BadRequestException,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { GerenciarArquivoManualUseCase } from '../../../../domain/manuais/application/use-cases/gerenciar-arquivo-manual'

@ApiTags('Manuais')
@ApiBearerAuth()
@Controller('/manuais')
@UseGuards(PermissionsGuard)
export class AddArquivoManualController {
  constructor(private gerenciarArquivo: GerenciarArquivoManualUseCase) {}

  @Post(':id/arquivos')
  @HttpCode(201)
  @RequirePermission('manuais', 'edit')
  @UseInterceptors(
    FileInterceptor('arquivo', { limits: { fileSize: 50 * 1024 * 1024 } }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Adicionar arquivo ao manual (max 50MB)' })
  async handle(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Arquivo obrigatório')

    const result = await this.gerenciarArquivo.adicionar(id, file)

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    return result.value
  }
}
