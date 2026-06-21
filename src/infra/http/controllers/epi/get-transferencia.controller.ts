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
import { PrismaService } from '../../../../prisma/prisma.service'

@ApiTags('EPI')
@ApiBearerAuth()
@Controller('/epi')
@UseGuards(PermissionsGuard)
export class GetTransferenciaController {
  constructor(private prisma: PrismaService) {}

  @Get('transferencias/:id')
  @RequirePermission('epi', 'access')
  @ApiOperation({ summary: 'Buscar transferência por ID' })
  async handle(@Param('id', ParseIntPipe) id: number) {
    const item = await this.prisma.epi_transferencias.findUnique({
      where: { id },
    })
    if (!item)
      throw new NotFoundException(`Transferência #${id} não encontrada`)
    return item
  }
}
