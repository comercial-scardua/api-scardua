import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequirePermission } from '../../auth/decorators/require-permission.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { PrismaService } from '../../prisma/prisma.service';

interface RunQueryBody {
  relatorioId?: number;
  sql?: string;
  parametros?: Record<string, unknown>;
}

@ApiTags('Reports')
@ApiBearerAuth()
@Controller('reports')
@UseGuards(PermissionsGuard)
export class ReportsController {
  constructor(private prisma: PrismaService) {}

  @Post('run-query')
  @HttpCode(200)
  @RequirePermission('reports', 'access')
  @ApiOperation({ summary: 'Executar query de relatório via Oracle bridge' })
  async runQuery(@Body() body: RunQueryBody) {
    const { relatorioId, sql, parametros } = body;

    let relatorio: {
      id: number;
      nome: string;
      query_sql: string;
      banco_dados: string;
      departamento: string;
      descricao: string | null;
    } | null = null;

    if (relatorioId !== undefined && relatorioId !== null) {
      relatorio = await this.prisma.relatorios.findUnique({
        where: { id: relatorioId },
        select: {
          id: true,
          nome: true,
          query_sql: true,
          banco_dados: true,
          departamento: true,
          descricao: true,
        },
      });
    }

    const effectiveSql = relatorio?.query_sql ?? sql ?? null;

    return {
      sql: effectiveSql,
      parametros: parametros ?? null,
      message: 'Execute via Oracle bridge',
      relatorio: relatorio ?? null,
    };
  }
}
