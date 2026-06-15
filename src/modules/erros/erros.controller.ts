import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RequirePermission } from '../../auth/decorators/require-permission.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import type { CriarErroDto } from './dto/criar-erro.dto';
import { ErrosRepository } from './repositories/erros.repository';

@ApiTags('Erros')
@ApiBearerAuth()
@Controller('erros')
@UseGuards(PermissionsGuard)
export class ErrosController {
  constructor(private repo: ErrosRepository) {}

  @Get()
  @HttpCode(200)
  @RequirePermission('erros', 'access')
  @ApiOperation({ summary: 'Listar erros e soluções ativos' })
  @ApiQuery({ name: 'categoria', required: false })
  @ApiQuery({ name: 'restrito', required: false, type: Boolean })
  @ApiQuery({ name: 'search', required: false })
  findAll(
    @Query('categoria') categoria?: string,
    @Query('restrito') restrito?: string,
    @Query('search') search?: string,
  ) {
    const restritoFilter =
      restrito === 'true' ? true : restrito === 'false' ? false : undefined;
    return this.repo.findAll({ categoria, restrito: restritoFilter, search });
  }

  @Post()
  @HttpCode(201)
  @RequirePermission('erros', 'edit')
  @ApiOperation({ summary: 'Criar erro/solução' })
  create(@Body() dto: CriarErroDto) {
    return this.repo.create(dto);
  }

  @Get(':id')
  @HttpCode(200)
  @RequirePermission('erros', 'access')
  @ApiOperation({ summary: 'Buscar erro/solução por ID com arquivos' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const erro = await this.repo.findById(id);
    if (!erro) throw new NotFoundException(`Erro #${id} não encontrado`);
    return erro;
  }

  @Post(':id')
  @HttpCode(200)
  @RequirePermission('erros', 'edit')
  @ApiOperation({ summary: 'Atualizar erro/solução' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CriarErroDto>,
  ) {
    const exists = await this.repo.findById(id);
    if (!exists) throw new NotFoundException(`Erro #${id} não encontrado`);
    return this.repo.update(id, dto);
  }
}
