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

@ApiTags('NCM Check')
@ApiBearerAuth()
@Controller('ncm-check')
@UseGuards(PermissionsGuard)
export class NcmCheckController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(200)
  @RequirePermission('ncm-check', 'access')
  @ApiOperation({ summary: 'Validar um NCM' })
  async validateOne(@Body() body: { ncm: string }) {
    const ncmCode = body.ncm?.trim() ?? '';
    const found = await this.prisma.ncm.findFirst({
      where: { codigo_ncm: { startsWith: ncmCode } },
    });

    return {
      valid: found !== null,
      ncm: ncmCode,
      found: found ?? null,
    };
  }

  @Post('batch')
  @HttpCode(200)
  @RequirePermission('ncm-check', 'access')
  @ApiOperation({ summary: 'Validar múltiplos NCMs' })
  async validateBatch(@Body() body: { ncms: string[] }) {
    const ncms: string[] = Array.isArray(body.ncms) ? body.ncms : [];

    const results = await Promise.all(
      ncms.map(async (ncmCode) => {
        const code = ncmCode?.trim() ?? '';
        const found = await this.prisma.ncm.findFirst({
          where: { codigo_ncm: { startsWith: code } },
        });
        return { ncm: code, valid: found !== null, found: found ?? null };
      }),
    );

    const validCount = results.filter((r) => r.valid).length;

    return {
      results,
      total: results.length,
      valid: validCount,
      invalid: results.length - validCount,
    };
  }
}
