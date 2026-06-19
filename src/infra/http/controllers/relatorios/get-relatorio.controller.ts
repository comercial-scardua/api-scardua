import {
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { GetRelatorioUseCase } from '../../../../domain/relatorios/application/use-cases/get-relatorio'

@ApiTags('Relatorios')
@ApiBearerAuth()
@Controller('/relatorios')
@UseGuards(PermissionsGuard)
export class GetRelatorioController {
  constructor(private getRelatorio: GetRelatorioUseCase) {}

  @Get(':id')
  @HttpCode(200)
  @RequirePermission('relatorios', 'access')
  @ApiOperation({ summary: 'Buscar relatorio por ID' })
  async handle(@Param('id', ParseIntPipe) id: number) {
    const result = await this.getRelatorio.execute({ relatorioId: id })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    return { relatorio: result.value.relatorio }
  }
}
