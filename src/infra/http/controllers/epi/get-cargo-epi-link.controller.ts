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
export class GetCargoEpiLinkController {
  constructor(private prisma: PrismaService) {}

  @Get('cargo-epi/:id')
  @RequirePermission('epi', 'access')
  @ApiOperation({ summary: 'Buscar vínculo EPI × Cargo por ID' })
  async handle(@Param('id', ParseIntPipe) id: number) {
    const link = await this.prisma.epi_cargo_obrigatorio.findUnique({
      where: { id },
    })
    if (!link)
      throw new NotFoundException(`Vínculo EPI × Cargo #${id} não encontrado`)
    return link
  }
}
