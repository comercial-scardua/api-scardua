import {
  Body,
  Controller,
  Get,
  HttpCode,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RequirePermission } from '../../auth/decorators/require-permission.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import type { CriarGestorEmpresaDto } from './dto/criar-gestor-empresa.dto';
import { GestorEmpresasRepository } from './repositories/gestor-empresas.repository';

@ApiTags('Gestor Empresas')
@ApiBearerAuth()
@Controller('gestor-empresas')
@UseGuards(PermissionsGuard)
export class GestorEmpresasController {
  constructor(private repo: GestorEmpresasRepository) {}

  @Get()
  @HttpCode(200)
  @RequirePermission('gestor-empresas', 'access')
  @ApiOperation({ summary: 'Listar gestores de empresas' })
  @ApiQuery({ name: 'empresaId', required: false, type: Number })
  @ApiQuery({ name: 'colaboradorId', required: false, type: Number })
  findAll(
    @Query('empresaId') empresaId?: string,
    @Query('colaboradorId') colaboradorId?: string,
  ) {
    return this.repo.findAll({
      empresaId: empresaId ? parseInt(empresaId, 10) : undefined,
      colaboradorId: colaboradorId ? parseInt(colaboradorId, 10) : undefined,
    });
  }

  @Put()
  @HttpCode(200)
  @RequirePermission('gestor-empresas', 'edit')
  @ApiOperation({ summary: 'Upsert gestor de empresa' })
  upsert(@Body() dto: CriarGestorEmpresaDto) {
    return this.repo.upsert(dto);
  }
}
