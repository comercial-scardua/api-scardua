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
import { GerenciarArquivoContratoUseCase } from '../../../../domain/contratos/application/use-cases/gerenciar-arquivo-contrato'

@ApiTags('Contratos')
@ApiBearerAuth()
@Controller('/contratos')
@UseGuards(PermissionsGuard)
export class AddArquivoContratoController {
  constructor(private gerenciarArquivo: GerenciarArquivoContratoUseCase) {}

  @Post(':id/arquivos')
  @HttpCode(201)
  @RequirePermission('contratos', 'edit')
  @UseInterceptors(
    FileInterceptor('arquivo', { limits: { fileSize: 10 * 1024 * 1024 } }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Adicionar arquivo ao contrato (max 10MB)' })
  async handle(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Arquivo obrigatório')

    const result = await this.gerenciarArquivo.adicionar(id, file)

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    return { url: result.value.url }
  }
}
