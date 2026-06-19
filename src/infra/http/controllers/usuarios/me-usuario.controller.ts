import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Patch,
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
import type { z } from 'zod'
import { CurrentUser } from '../../../../auth/decorators/current-user.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import type { JwtPayload } from '../../../../auth/types/jwt-payload.type'
import { AtualizarUsuarioSchema } from '../../../../domain/usuarios/application/dtos/usuario-schema'
import { EditUsuarioUseCase } from '../../../../domain/usuarios/application/use-cases/edit-usuario'
import { GetUsuarioUseCase } from '../../../../domain/usuarios/application/use-cases/get-usuario'
import { UpdateFotoUsuarioUseCase } from '../../../../domain/usuarios/application/use-cases/update-foto-usuario'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

type AtualizarUsuarioBody = z.infer<typeof AtualizarUsuarioSchema>

@ApiTags('Usuários')
@ApiBearerAuth()
@Controller('/usuarios')
@UseGuards(PermissionsGuard)
export class MeUsuarioController {
  constructor(
    private getUsuario: GetUsuarioUseCase,
    private editUsuario: EditUsuarioUseCase,
    private updateFoto: UpdateFotoUsuarioUseCase,
  ) {}

  @Get('me')
  @HttpCode(200)
  @ApiOperation({ summary: 'Perfil do usuário logado' })
  async me(@CurrentUser() user: JwtPayload) {
    const result = await this.getUsuario.execute({ usuarioId: user.userId })
    if (result.isLeft()) throw new NotFoundException(result.value.message)
    return { usuario: result.value.usuario }
  }

  @Patch('me')
  @HttpCode(204)
  @ApiOperation({ summary: 'Atualizar próprio perfil' })
  async update(
    @CurrentUser() user: JwtPayload,
    @Body(new ZodValidationPipe(AtualizarUsuarioSchema))
    body: AtualizarUsuarioBody,
  ) {
    const result = await this.editUsuario.execute({
      usuarioId: user.userId,
      data: body,
    })
    if (result.isLeft()) throw new NotFoundException(result.value.message)
  }

  @Post('me/foto')
  @HttpCode(200)
  @UseInterceptors(
    FileInterceptor('foto', { limits: { fileSize: 5 * 1024 * 1024 } }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Atualizar foto do próprio perfil (max 5MB)' })
  async foto(
    @CurrentUser() user: JwtPayload,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Arquivo obrigatório')
    const result = await this.updateFoto.execute({
      usuarioId: user.userId,
      file,
    })
    if (result.isLeft()) throw new NotFoundException(result.value.message)
    return { fotoUrl: result.value.fotoUrl }
  }
}
