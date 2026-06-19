import {
  BadRequestException,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
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
import { UpdateFotoUsuarioUseCase } from '../../../../domain/usuarios/application/use-cases/update-foto-usuario'

@ApiTags('Usuários')
@ApiBearerAuth()
@Controller('/usuarios')
@UseGuards(PermissionsGuard)
export class UpdateFotoUsuarioController {
  constructor(private updateFoto: UpdateFotoUsuarioUseCase) {}

  @Post(':id/foto')
  @HttpCode(200)
  @RequirePermission('usuarios', 'edit')
  @UseInterceptors(
    FileInterceptor('foto', { limits: { fileSize: 5 * 1024 * 1024 } }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Atualizar foto de um usuário (max 5MB)' })
  async handle(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Arquivo obrigatório')

    const result = await this.updateFoto.execute({ usuarioId: id, file })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    return { fotoUrl: result.value.fotoUrl }
  }
}
