import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { RequirePermission } from '../../auth/decorators/require-permission.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import type { JwtPayload } from '../../auth/types/jwt-payload.type';
import type { PrismaService } from '../../prisma/prisma.service';
import type { AtualizarUsuarioDto } from './dto/atualizar-usuario.dto';
import type { CriarUsuarioDto } from './dto/criar-usuario.dto';
import type { UsuariosRepository } from './repositories/usuarios.repository';
import type { AtualizarFotoUsuarioUseCase } from './use-cases/atualizar-foto-usuario.use-case';
import type { AtualizarUsuarioUseCase } from './use-cases/atualizar-usuario.use-case';
import type { BuscarUsuarioUseCase } from './use-cases/buscar-usuario.use-case';
import type { CriarUsuarioUseCase } from './use-cases/criar-usuario.use-case';
import type { DesativarUsuarioUseCase } from './use-cases/desativar-usuario.use-case';
import { CpfJaCadastradoError } from './use-cases/errors/cpf-ja-cadastrado.error';
import { EmailJaCadastradoError } from './use-cases/errors/email-ja-cadastrado.error';
import type { ListarUsuariosUseCase } from './use-cases/listar-usuarios.use-case';

@ApiTags('Usuários')
@ApiBearerAuth()
@Controller('usuarios')
@UseGuards(PermissionsGuard)
export class UsuariosController {
  constructor(
    private listar: ListarUsuariosUseCase,
    private buscar: BuscarUsuarioUseCase,
    private criar: CriarUsuarioUseCase,
    private atualizar: AtualizarUsuarioUseCase,
    private desativar: DesativarUsuarioUseCase,
    private atualizarFoto: AtualizarFotoUsuarioUseCase,
    private repo: UsuariosRepository,
    private prisma: PrismaService,
  ) {}

  @Get()
  @HttpCode(200)
  @RequirePermission('usuarios', 'access')
  @ApiOperation({ summary: 'Listar usuários' })
  @ApiQuery({ name: 'setor', required: false })
  @ApiQuery({ name: 'role', required: false })
  @ApiQuery({ name: 'oculto', required: false, type: Boolean })
  findAll(
    @Query('setor') setor?: string,
    @Query('role') role?: string,
    @Query('oculto') oculto?: boolean,
  ) {
    return this.listar.execute({ setor, role, oculto });
  }

  @Get('me')
  @HttpCode(200)
  @ApiOperation({ summary: 'Perfil do usuário logado' })
  async findMe(@CurrentUser() user: JwtPayload) {
    const result = await this.buscar.execute(user.userId);
    if (result.isLeft()) throw new NotFoundException(result.value.message);
    return result.value.usuario;
  }

  @Get('checkpermission')
  @HttpCode(200)
  @ApiOperation({ summary: 'Verificar se o usuário logado tem acesso a uma página' })
  @ApiQuery({ name: 'page', required: true })
  async checkPermission(
    @Query('page') page: string,
    @CurrentUser() user: JwtPayload,
  ) {
    if (!page) throw new BadRequestException('Parâmetro "page" é obrigatório');

    if (user.role === 'ADMIN') {
      return {
        hasAccess: true,
        page,
        role: 'ADMIN',
        permissions: { canAccess: true, canEdit: true, canDelete: true },
      };
    }

    const perm = await this.prisma.permission.findUnique({
      where: { userId_page: { userId: user.userId, page } },
    });

    return {
      hasAccess: perm?.canAccess ?? false,
      page,
      role: user.role,
      permissions: perm
        ? { canAccess: perm.canAccess, canEdit: perm.canEdit, canDelete: perm.canDelete }
        : null,
    };
  }

  @Get('all-permissions')
  @HttpCode(200)
  @RequirePermission('usuarios', 'access')
  @ApiOperation({ summary: 'Todas as permissões de todos os usuários (painel admin)' })
  async allPermissions() {
    const perms = await this.prisma.permission.findMany();
    const result: Record<string, Record<string, { canAccess: boolean; canEdit: boolean; canDelete: boolean }>> = {};

    for (const p of perms) {
      if (!result[p.userId]) result[p.userId] = {};
      result[p.userId][p.page] = { canAccess: p.canAccess, canEdit: p.canEdit, canDelete: p.canDelete };
    }

    return result;
  }

  @Get(':id')
  @HttpCode(200)
  @RequirePermission('usuarios', 'access')
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  async findOne(@Param('id') id: string) {
    const result = await this.buscar.execute(id);
    if (result.isLeft()) throw new NotFoundException(result.value.message);
    return result.value.usuario;
  }

  @Post()
  @HttpCode(201)
  @RequirePermission('usuarios', 'edit')
  @ApiOperation({ summary: 'Criar usuário' })
  async create(@Body() dto: CriarUsuarioDto) {
    const result = await this.criar.execute(dto);

    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case EmailJaCadastradoError:
          throw new ConflictException(error.message);
        case CpfJaCadastradoError:
          throw new ConflictException(error.message);
        default:
          throw new ConflictException(error.message);
      }
    }

    return result.value;
  }

  @Patch('me')
  @HttpCode(200)
  @ApiOperation({ summary: 'Atualizar próprio perfil' })
  async updateMe(@CurrentUser() user: JwtPayload, @Body() dto: AtualizarUsuarioDto) {
    const result = await this.atualizar.execute(user.userId, dto);
    if (result.isLeft()) throw new NotFoundException(result.value.message);
    return result.value.usuario;
  }

  @Post('me/foto')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('foto', { limits: { fileSize: 5 * 1024 * 1024 } }))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Atualizar foto do próprio perfil (max 5MB)' })
  async updateMeFoto(
    @CurrentUser() user: JwtPayload,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Arquivo obrigatório');
    const result = await this.atualizarFoto.execute(user.userId, file);
    if (result.isLeft()) throw new NotFoundException(result.value.message);
    return result.value;
  }

  @Post(':id/foto')
  @HttpCode(200)
  @RequirePermission('usuarios', 'edit')
  @UseInterceptors(FileInterceptor('foto', { limits: { fileSize: 5 * 1024 * 1024 } }))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Atualizar foto de um usuário (max 5MB)' })
  async updateFoto(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Arquivo obrigatório');
    const result = await this.atualizarFoto.execute(id, file);
    if (result.isLeft()) throw new NotFoundException(result.value.message);
    return result.value;
  }

  @Patch(':id')
  @HttpCode(200)
  @RequirePermission('usuarios', 'edit')
  @ApiOperation({ summary: 'Atualizar usuário' })
  async update(@Param('id') id: string, @Body() dto: AtualizarUsuarioDto) {
    const result = await this.atualizar.execute(id, dto);

    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case EmailJaCadastradoError:
          throw new ConflictException(error.message);
        default:
          throw new NotFoundException(error.message);
      }
    }

    return result.value.usuario;
  }

  @Delete(':id')
  @HttpCode(204)
  @RequirePermission('usuarios', 'edit')
  @ApiOperation({ summary: 'Desativar usuário (soft delete)' })
  async remove(@Param('id') id: string) {
    const result = await this.desativar.execute(id);
    if (result.isLeft()) throw new NotFoundException(result.value.message);
  }
}
