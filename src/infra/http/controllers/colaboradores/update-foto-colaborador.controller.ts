import {
  BadRequestException,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
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
import { UpdateFotoColaboradorUseCase } from '../../../../domain/colaboradores/application/use-cases/update-foto-colaborador'

@ApiTags('Colaboradores')
@ApiBearerAuth()
@Controller('/colaboradores')
@UseGuards(PermissionsGuard)
export class UpdateFotoColaboradorController {
  constructor(private updateFoto: UpdateFotoColaboradorUseCase) {}

  @Patch(':id/foto')
  @HttpCode(200)
  @RequirePermission('colaboradores', 'edit')
  @UseInterceptors(
    FileInterceptor('foto', { limits: { fileSize: 5 * 1024 * 1024 } }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Atualizar foto do colaborador (upload para Supabase)',
  })
  async handle(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Arquivo de foto é obrigatório')

    const result = await this.updateFoto.execute({ colaboradorId: id, file })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    return { fotoUrl: result.value.fotoUrl }
  }
}
