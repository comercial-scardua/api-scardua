import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { EpiRepository } from '../../../../domain/epi/application/repositories/epi-repository'
import { PrismaService } from '../../../../prisma/prisma.service'

@ApiTags('EPI')
@ApiBearerAuth()
@Controller('/epi')
@UseGuards(PermissionsGuard)
export class GetColaboradorController {
  constructor(
    private prisma: PrismaService,
    private repo: EpiRepository,
  ) {}

  @Get('colaboradores/:id')
  @RequirePermission('epi', 'access')
  @ApiOperation({ summary: 'Dados EPI de um colaborador específico' })
  async handle(@Param('id', ParseIntPipe) id: number) {
    const colaborador = await this.prisma.colaboradores.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        sobrenome: true,
        cargo: true,
        empresa: { select: { id: true, nomeEmpresa: true, numero: true } },
        oculto: true,
      },
    })
    if (!colaborador)
      throw new NotFoundException(`Colaborador #${id} não encontrado`)
    const movimentacoes = await this.repo.findMovimentacoesByColaborador(id)
    return { ...colaborador, movimentacoes }
  }
}
