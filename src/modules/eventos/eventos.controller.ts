import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { RequirePermission } from '../../auth/decorators/require-permission.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import type { JwtPayload } from '../../auth/types/jwt-payload.type';
import type { CriarEventoDto } from './dto/criar-evento.dto';
import { EventosRepository } from './repositories/eventos.repository';

@ApiTags('Eventos')
@ApiBearerAuth()
@Controller('eventos')
@UseGuards(PermissionsGuard)
export class EventosController {
  constructor(private repo: EventosRepository) {}

  @Get()
  @HttpCode(200)
  @RequirePermission('eventos', 'access')
  @ApiOperation({ summary: 'Listar eventos' })
  @ApiQuery({ name: 'mes', required: false, type: Number })
  @ApiQuery({ name: 'ano', required: false, type: Number })
  @ApiQuery({ name: 'tipo', required: false })
  @ApiQuery({ name: 'empresaId', required: false, type: Number })
  @ApiQuery({ name: 'oculto', required: false, type: Boolean })
  findAll(
    @Query('mes') mes?: string,
    @Query('ano') ano?: string,
    @Query('tipo') tipo?: string,
    @Query('empresaId') empresaId?: string,
    @Query('oculto') oculto?: string,
  ) {
    return this.repo.findAll({
      mes: mes ? parseInt(mes, 10) : undefined,
      ano: ano ? parseInt(ano, 10) : undefined,
      tipo,
      empresaId: empresaId ? parseInt(empresaId, 10) : undefined,
      oculto: oculto === 'true' ? true : oculto === 'false' ? false : undefined,
    });
  }

  @Post()
  @HttpCode(201)
  @RequirePermission('eventos', 'edit')
  @ApiOperation({ summary: 'Criar evento' })
  create(@Body() dto: CriarEventoDto, @CurrentUser() user: JwtPayload) {
    return this.repo.create(dto, user.userId);
  }

  @Patch(':id')
  @HttpCode(200)
  @RequirePermission('eventos', 'edit')
  @ApiOperation({ summary: 'Atualizar evento' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CriarEventoDto>,
  ) {
    const exists = await this.repo.findById(id);
    if (!exists) throw new NotFoundException(`Evento #${id} não encontrado`);
    return this.repo.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @RequirePermission('eventos', 'edit')
  @ApiOperation({ summary: 'Soft delete de evento (oculto: true)' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const exists = await this.repo.findById(id);
    if (!exists) throw new NotFoundException(`Evento #${id} não encontrado`);
    await this.repo.softDelete(id);
  }
}
