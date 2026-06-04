import {
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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { RequirePermission } from '../../auth/decorators/require-permission.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import type { JwtPayload } from '../../auth/types/jwt-payload.type';
import type { AtualizarUsuarioDto } from './dto/atualizar-usuario.dto';
import type { CriarUsuarioDto } from './dto/criar-usuario.dto';
import type { UsuariosRepository } from './repositories/usuarios.repository';
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
    private repo: UsuariosRepository,
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

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message);
    }

    return result.value.usuario;
  }

  @Get(':id')
  @HttpCode(200)
  @RequirePermission('usuarios', 'access')
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  async findOne(@Param('id') id: string) {
    const result = await this.buscar.execute(id);

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message);
    }

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
  async updateMe(
    @CurrentUser() user: JwtPayload,
    @Body() dto: AtualizarUsuarioDto,
  ) {
    const result = await this.atualizar.execute(user.userId, dto);

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message);
    }

    return result.value.usuario;
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

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message);
    }
  }
}
