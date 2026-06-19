import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../auth/guards/permissions.guard'
import { PrismaService } from '../../prisma/prisma.service'

interface UpsertMonitorDto {
  colaboradorId: number
  tipo: string
  data: string
  horaEntrada?: string
  horaSaida?: string
  observacao?: string
}

@ApiTags('Monitor Registros')
@ApiBearerAuth()
@Controller('monitor-registros')
@UseGuards(PermissionsGuard)
export class MonitorRegistrosController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @HttpCode(200)
  @RequirePermission('monitor-registros', 'access')
  @ApiOperation({ summary: 'Listar registros recentes para monitoramento' })
  @ApiQuery({ name: 'colaboradorId', required: false, type: Number })
  @ApiQuery({ name: 'dataInicio', required: false })
  @ApiQuery({ name: 'dataFim', required: false })
  @ApiQuery({ name: 'tipo', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query('colaboradorId') colaboradorId?: string,
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
    @Query('tipo') tipo?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1
    const limitNum = limit ? parseInt(limit, 10) : 50
    const skip = (pageNum - 1) * limitNum

    const where: Record<string, unknown> = {}

    if (colaboradorId) {
      where['colaborador_id'] = parseInt(colaboradorId, 10)
    }

    if (tipo) {
      where['tipo'] = tipo
    }

    if (dataInicio || dataFim) {
      const dataFilter: Record<string, Date> = {}
      if (dataInicio) dataFilter['gte'] = new Date(dataInicio)
      if (dataFim) dataFilter['lte'] = new Date(dataFim)
      where['data'] = dataFilter
    }

    const [registros, total] = await Promise.all([
      this.prisma.registros_banco_horas.findMany({
        where,
        include: {
          colaborador: {
            select: { id: true, nome: true, sobrenome: true, setor: true },
          },
        },
        orderBy: { data: 'desc' },
        skip,
        take: limitNum,
      }),
      this.prisma.registros_banco_horas.count({ where }),
    ])

    // Estatísticas básicas por tipo
    const tipoStats = await this.prisma.registros_banco_horas.groupBy({
      by: ['tipo'],
      where,
      _count: { id: true },
    })

    return {
      data: registros,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
      estatisticas: {
        total,
        tipos: tipoStats.map((t) => ({ tipo: t.tipo, count: t._count.id })),
      },
    }
  }

  @Post()
  @HttpCode(201)
  @RequirePermission('monitor-registros', 'edit')
  @ApiOperation({ summary: 'Registrar/atualizar entrada de monitoramento' })
  async upsert(@Body() dto: UpsertMonitorDto) {
    const colaborador = await this.prisma.colaboradores.findUnique({
      where: { id: dto.colaboradorId },
      select: { id: true, nome: true, sobrenome: true },
    })

    const funcionarioNome = colaborador
      ? `${colaborador.nome ?? ''} ${colaborador.sobrenome ?? ''}`.trim()
      : `Colaborador #${dto.colaboradorId}`

    const dataRegistro = new Date(dto.data)

    // Upsert: se já existe registro do mesmo colaborador/tipo/data, atualiza
    const existing = await this.prisma.registros_banco_horas.findFirst({
      where: {
        colaborador_id: dto.colaboradorId,
        tipo: dto.tipo,
        data: dataRegistro,
      },
    })

    if (existing) {
      return this.prisma.registros_banco_horas.update({
        where: { id: existing.id },
        data: {
          hora_inicio: dto.horaEntrada ?? existing.hora_inicio,
          hora_fim: dto.horaSaida ?? existing.hora_fim,
          observacao: dto.observacao ?? existing.observacao,
          data_modificado: new Date(),
        },
      })
    }

    return this.prisma.registros_banco_horas.create({
      data: {
        colaborador_id: dto.colaboradorId,
        funcionario_nome: funcionarioNome,
        tipo: dto.tipo,
        data: dataRegistro,
        hora_inicio: dto.horaEntrada ?? null,
        hora_fim: dto.horaSaida ?? null,
        observacao: dto.observacao ?? null,
        data_modificado: new Date(),
      },
    })
  }
}
