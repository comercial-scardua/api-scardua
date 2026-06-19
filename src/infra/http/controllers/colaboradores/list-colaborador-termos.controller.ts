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
import { ListColaboradorTermosUseCase } from '../../../../domain/colaboradores/application/use-cases/list-colaborador-termos'

@ApiTags('Colaboradores')
@ApiBearerAuth()
@Controller('/colaboradores')
@UseGuards(PermissionsGuard)
export class ListColaboradorTermosController {
  constructor(private listTermos: ListColaboradorTermosUseCase) {}

  @Get(':id/termos')
  @HttpCode(200)
  @RequirePermission('colaboradores', 'access')
  @ApiOperation({ summary: 'Listar termos assinados pelo colaborador' })
  async handle(@Param('id', ParseIntPipe) id: number) {
    const result = await this.listTermos.execute({ colaboradorId: id })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    return { termos: result.value.termos }
  }
}
