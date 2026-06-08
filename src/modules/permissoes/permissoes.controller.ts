import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequirePermission } from '../../auth/decorators/require-permission.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import type { DefinirPermissaoPaginaDto } from './dto/definir-permissao-pagina.dto';
import type { DefinirPermissoesDto } from './dto/definir-permissoes.dto';
import { PAGINAS } from './paginas.constant';
import { DefinirPermissaoPaginaUseCase } from './use-cases/definir-permissao-pagina.use-case';
import { DefinirPermissoesUseCase } from './use-cases/definir-permissoes.use-case';
import { UsuarioNaoEncontradoError } from './use-cases/errors/usuario-nao-encontrado.error';
import { ListarPermissoesUseCase } from './use-cases/listar-permissoes.use-case';
import { RemoverPermissaoUseCase } from './use-cases/remover-permissao.use-case';

@ApiTags('Permissões')
@ApiBearerAuth()
@Controller('permissoes')
@UseGuards(PermissionsGuard)
export class PermissoesController {
  constructor(
    private listar: ListarPermissoesUseCase,
    private definir: DefinirPermissoesUseCase,
    private definirPagina: DefinirPermissaoPaginaUseCase,
    private remover: RemoverPermissaoUseCase,
  ) {}

  @Get('paginas')
  @HttpCode(200)
  @ApiOperation({ summary: 'Listar todas as páginas disponíveis no sistema' })
  listarPaginas() {
    return { paginas: PAGINAS };
  }

  @Get(':userId')
  @HttpCode(200)
  @RequirePermission('permissoes', 'access')
  @ApiOperation({
    summary: 'Buscar permissões de um usuário (tabela + permissions_json mesclados)',
  })
  findAll(@Param('userId') userId: string) {
    return this.listar.execute(userId);
  }

  @Put(':userId')
  @HttpCode(200)
  @RequirePermission('permissoes', 'edit')
  @ApiOperation({
    summary:
      'Definir todas as permissões de um usuário (batch upsert + salva permissions_json)',
  })
  async definirTodas(
    @Param('userId') userId: string,
    @Body() dto: DefinirPermissoesDto,
  ) {
    const result = await this.definir.execute(userId, dto);

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case UsuarioNaoEncontradoError:
          throw new NotFoundException(error.message);
        default:
          throw new NotFoundException(error.message);
      }
    }

    return result.value.permissions;
  }

  @Put(':userId/:page')
  @HttpCode(200)
  @RequirePermission('permissoes', 'edit')
  @ApiOperation({ summary: 'Definir permissão de uma página específica' })
  async definirPaginaRoute(
    @Param('userId') userId: string,
    @Param('page') page: string,
    @Body() dto: DefinirPermissaoPaginaDto,
  ) {
    const result = await this.definirPagina.execute(userId, page, dto);

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message);
    }

    return result.value.permissao;
  }

  @Delete(':userId/:page')
  @HttpCode(204)
  @RequirePermission('permissoes', 'edit')
  @ApiOperation({ summary: 'Remover permissão de uma página específica' })
  async removerPagina(
    @Param('userId') userId: string,
    @Param('page') page: string,
  ) {
    const result = await this.remover.execute(userId, page);

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message);
    }
  }
}
