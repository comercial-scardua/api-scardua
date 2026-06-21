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
import { ToggleOcultoContaUseCase } from '../../../../domain/conta-corrente/application/use-cases/toggle-oculto-conta'

@ApiTags('Conta Corrente')
@ApiBearerAuth()
@Controller('/conta-corrente')
@UseGuards(PermissionsGuard)
export class ToggleOcultoController {
  constructor(private toggleOculto: ToggleOcultoContaUseCase) {}

  @Put(':id')
  @HttpCode(200)
  @RequirePermission('contacorrente', 'access')
  @ApiOperation({ summary: 'Alternar visibilidade da conta (oculto/visível)' })
  async handle(@Param('id', ParseIntPipe) id: number) {
    const result = await this.toggleOculto.execute({ id })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    return result.value.conta
  }
}
