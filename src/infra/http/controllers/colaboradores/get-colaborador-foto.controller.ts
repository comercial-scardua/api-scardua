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
import { GetColaboradorUseCase } from '../../../../domain/colaboradores/application/use-cases/get-colaborador'

@ApiTags('Colaboradores')
@ApiBearerAuth()
@Controller('/colaboradores')
@UseGuards(PermissionsGuard)
export class GetColaboradorFotoController {
  constructor(private getColaborador: GetColaboradorUseCase) {}

  @Get(':id/foto')
  @HttpCode(200)
  @RequirePermission('colaboradores', 'access')
  @ApiOperation({ summary: 'Obter URL da foto do colaborador' })
  async handle(@Param('id', ParseIntPipe) id: number) {
    const result = await this.getColaborador.execute({ colaboradorId: id })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    return { fotoUrl: result.value.colaborador.foto ?? null }
  }
}
