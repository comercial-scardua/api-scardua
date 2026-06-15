import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RequirePermission } from '../../auth/decorators/require-permission.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import type { ImportarPrecosDto } from './dto/importar-precos.dto';
import { ImportacaoPrecosRepository } from './repositories/importacao-precos.repository';

@ApiTags('Importação de Preços')
@ApiBearerAuth()
@Controller('importacao-precos')
@UseGuards(PermissionsGuard)
export class ImportacaoPrecosController {
  constructor(private repo: ImportacaoPrecosRepository) {}

  @Post('importar')
  @HttpCode(201)
  @RequirePermission('importacao-precos', 'edit')
  @ApiOperation({ summary: 'Importar preços (upsert em massa no modelo de produtos)' })
  importar(@Body() dto: ImportarPrecosDto) {
    return this.repo.importar(dto);
  }

  @Get('exportar')
  @HttpCode(200)
  @RequirePermission('importacao-precos', 'access')
  @ApiOperation({ summary: 'Exportar preços dos produtos (filtros: categoria, grupo, marca)' })
  @ApiQuery({ name: 'categoria', required: false, type: String })
  @ApiQuery({ name: 'grupo', required: false, type: String })
  @ApiQuery({ name: 'marca', required: false, type: String })
  exportar(
    @Query('categoria') categoria?: string,
    @Query('grupo') grupo?: string,
    @Query('marca') marca?: string,
  ) {
    return this.repo.exportar(categoria, grupo, marca);
  }

  @Get('categorias')
  @HttpCode(200)
  @RequirePermission('importacao-precos', 'access')
  @ApiOperation({ summary: 'Listar categorias distintas dos produtos' })
  categorias() {
    return this.repo.categorias();
  }

  @Get('grupos')
  @HttpCode(200)
  @RequirePermission('importacao-precos', 'access')
  @ApiOperation({ summary: 'Listar grupos distintos dos produtos (campo não disponível no modelo atual)' })
  grupos() {
    return this.repo.grupos();
  }

  @Get('marcas')
  @HttpCode(200)
  @RequirePermission('importacao-precos', 'access')
  @ApiOperation({ summary: 'Listar marcas distintas dos produtos (campo não disponível no modelo atual)' })
  marcas() {
    return this.repo.marcas();
  }
}
