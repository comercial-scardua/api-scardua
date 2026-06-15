import { BadRequestException, Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RequirePermission } from '../../auth/decorators/require-permission.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { PrismaService } from '../../prisma/prisma.service';

function formatCpf(digits: string): string {
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

@ApiTags('Check CPF')
@ApiBearerAuth()
@Controller('check-cpf')
@UseGuards(PermissionsGuard)
export class CheckCpfController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @HttpCode(200)
  @RequirePermission('check-cpf', 'access')
  @ApiOperation({ summary: 'Validar CPF e verificar se já existe no sistema' })
  @ApiQuery({ name: 'cpf', required: true, description: 'CPF (somente dígitos, 11 caracteres)' })
  async checkCpf(@Query('cpf') cpf: string) {
    if (!cpf) {
      throw new BadRequestException('Parâmetro cpf é obrigatório');
    }

    const cpfDigits = cpf.replace(/\D/g, '');
    const valid = cpfDigits.length === 11;

    if (!valid) {
      return { valid: false, exists: false, existsIn: null };
    }

    // users.cpf is stored formatted (Char 14): "123.456.789-09"
    const cpfFormatado = formatCpf(cpfDigits);
    const userWithCpf = await this.prisma.users.findUnique({
      where: { cpf: cpfFormatado },
      select: { id: true },
    });

    if (userWithCpf) {
      return { valid: true, exists: true, existsIn: 'users' as const };
    }

    // colaboradores.cpf may be stored in any format — search by digits too
    const colaboradorWithCpf = await this.prisma.colaboradores.findFirst({
      where: { cpf: { in: [cpfDigits, cpfFormatado] } },
      select: { id: true },
    });

    if (colaboradorWithCpf) {
      return { valid: true, exists: true, existsIn: 'colaboradores' as const };
    }

    return { valid: true, exists: false, existsIn: null };
  }
}
