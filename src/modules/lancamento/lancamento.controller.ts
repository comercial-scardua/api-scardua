import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequirePermission } from '../../auth/decorators/require-permission.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import type { CriarLancamentoDto } from './dto/criar-lancamento.dto';
import { LancamentoRepository } from './repositories/lancamento.repository';

@ApiTags('Lancamento')
@ApiBearerAuth()
@Controller('lancamento')
@UseGuards(PermissionsGuard)
export class LancamentoController {
  constructor(private repo: LancamentoRepository) {}

  @Post()
  @HttpCode(201)
  @RequirePermission('lancamento', 'edit')
  @ApiOperation({ summary: 'Criar lançamento' })
  create(@Body() dto: CriarLancamentoDto) {
    return this.repo.create(dto);
  }

  @Delete()
  @HttpCode(204)
  @RequirePermission('lancamento', 'edit')
  @ApiOperation({ summary: 'Excluir lançamento por id no body' })
  async remove(@Body() body: { id: number }) {
    await this.repo.remove(body.id);
  }

  @Post('usuario/:id')
  @HttpCode(201)
  @RequirePermission('lancamento', 'edit')
  @ApiOperation({ summary: 'Criar lançamento para um usuário (por colaboradorId)' })
  createForUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Omit<CriarLancamentoDto, 'contaCorrenteId'>,
  ) {
    return this.repo.createForUser(id, dto);
  }

  @Delete('usuario/:id')
  @HttpCode(204)
  @RequirePermission('lancamento', 'edit')
  @ApiOperation({ summary: 'Excluir lançamento de um usuário' })
  async removeForUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { lancamentoId: number },
  ) {
    await this.repo.removeForUser(id, body.lancamentoId);
  }
}
