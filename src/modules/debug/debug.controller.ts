import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../auth/guards/permissions.guard'
import { PrismaService } from '../../prisma/prisma.service'

@ApiTags('Debug')
@ApiBearerAuth()
@Controller('debug')
@UseGuards(PermissionsGuard)
export class DebugController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('permissions')
  @HttpCode(200)
  @RequirePermission('debug', 'access')
  @ApiOperation({ summary: 'Listar todas as permissões cadastradas' })
  async permissions() {
    const permissions = await this.prisma.permission.findMany({
      orderBy: [{ userId: 'asc' }, { page: 'asc' }],
    })
    return {
      total: permissions.length,
      permissions,
    }
  }
}

@ApiTags('Debug')
@ApiBearerAuth()
@Controller('')
@UseGuards(PermissionsGuard)
export class DebugUtilsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('debug-ncm')
  @HttpCode(200)
  @RequirePermission('debug', 'access')
  @ApiOperation({ summary: 'Debug dos NCMs — total e amostra de 10' })
  async debugNcm() {
    const total = await this.prisma.ncm.count()
    const amostra = await this.prisma.ncm.findMany({ take: 10 })
    return { total, amostra }
  }

  @Get('debug-ncm-format')
  @HttpCode(200)
  @RequirePermission('debug', 'access')
  @ApiOperation({
    summary: 'Debug do formato dos NCMs — primeiros 5 registros completos',
  })
  async debugNcmFormat() {
    const registros = await this.prisma.ncm.findMany({ take: 5 })
    return {
      total: await this.prisma.ncm.count(),
      exemplos: registros,
      campos: registros.length > 0 ? Object.keys(registros[0]) : [],
    }
  }

  @Get('debug-usuarios')
  @HttpCode(200)
  @RequirePermission('debug', 'access')
  @ApiOperation({
    summary: 'Debug dos usuários — contagens por role sem dados sensíveis',
  })
  async debugUsuarios() {
    const total = await this.prisma.users.count()
    const porRole = await this.prisma.users.groupBy({
      by: ['role'],
      _count: { id: true },
    })
    return {
      total,
      porRole: porRole.map((r) => ({ role: r.role, quantidade: r._count.id })),
    }
  }
}
