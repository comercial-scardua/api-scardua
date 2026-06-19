import {
  Body,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../auth/guards/permissions.guard'
import { LancamentoBulkDto } from './dto/criar-lancamento.dto'
import { LancamentoRepository } from './repositories/lancamento.repository'

@ApiTags('Lancamento')
@ApiBearerAuth()
@Controller('lancamento')
@UseGuards(PermissionsGuard)
export class LancamentoController {
  constructor(private repo: LancamentoRepository) {}

  @Post()
  @HttpCode(201)
  @RequirePermission('lancamento', 'edit')
  @ApiOperation({
    summary: 'Criar lançamento(s) — suporta formato bulk com lancamentos[]',
  })
  create(@Body() dto: LancamentoBulkDto) {
    return this.repo.createBulk(dto)
  }

  @Delete()
  @HttpCode(200)
  @RequirePermission('lancamento', 'edit')
  @ApiOperation({
    summary: 'Excluir todos os lançamentos de uma conta corrente',
  })
  @ApiQuery({ name: 'contaCorrenteId', required: true, type: String })
  async remove(@Query('contaCorrenteId') contaCorrenteId: string) {
    if (!contaCorrenteId)
      throw new NotFoundException('contaCorrenteId é obrigatório')
    const result = await this.repo.removeByContaCorrenteId(
      parseInt(contaCorrenteId, 10),
    )
    return {
      success: true,
      message: `${result.deleted} lançamento(s) excluído(s)`,
    }
  }

  @Post('usuario/:id')
  @HttpCode(201)
  @RequirePermission('lancamento', 'edit')
  @ApiOperation({
    summary: 'Criar lançamento(s) para um usuário (por colaboradorId)',
  })
  createForUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: LancamentoBulkDto,
  ) {
    return this.repo.createBulkForUser(id, body)
  }

  @Delete('usuario/:id')
  @HttpCode(204)
  @RequirePermission('lancamento', 'edit')
  @ApiOperation({ summary: 'Excluir lançamento de um usuário' })
  async removeForUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { lancamentoId: number },
  ) {
    await this.repo.removeForUser(id, body.lancamentoId)
  }
}
