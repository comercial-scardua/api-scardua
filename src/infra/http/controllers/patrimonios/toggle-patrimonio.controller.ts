import {
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { ToggleVisibilidadePatrimonioUseCase } from '../../../../domain/patrimonios/application/use-cases/toggle-visibilidade-patrimonio'

@ApiTags('Patrimônios')
@ApiBearerAuth()
@Controller('/patrimonio')
@UseGuards(PermissionsGuard)
export class TogglePatrimonioController {
  constructor(
    private toggleVisibilidade: ToggleVisibilidadePatrimonioUseCase,
  ) {}

  @Put(':id')
  @HttpCode(200)
  @RequirePermission('patrimonio', 'edit')
  @ApiOperation({
    summary: 'Alternar visibilidade do patrimônio (oculto/visível)',
  })
  async handle(@Param('id', ParseIntPipe) id: number) {
    const result = await this.toggleVisibilidade.execute({ patrimonioId: id })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    return result.value
  }
}
