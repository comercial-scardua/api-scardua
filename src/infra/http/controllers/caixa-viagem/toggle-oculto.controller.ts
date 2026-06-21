import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { ToggleOcultoCaixaViagemUseCase } from '../../../../domain/caixa-viagem/application/use-cases/toggle-oculto-caixa-viagem'

@ApiTags('Caixa Viagem')
@ApiBearerAuth()
@Controller('/caixaviagem')
@UseGuards(PermissionsGuard)
export class ToggleOcultoController {
  constructor(
    private toggleOcultoCaixaViagem: ToggleOcultoCaixaViagemUseCase,
  ) {}

  @Post('ocultar')
  @HttpCode(200)
  @RequirePermission('caixaviagem', 'edit')
  @ApiOperation({
    summary: 'Alternar visibilidade (oculto/visível) de um caixa',
  })
  async handle(@Body('id') id: number) {
    if (!id) {
      throw new NotFoundException('id é obrigatório')
    }

    const result = await this.toggleOcultoCaixaViagem.execute({ id })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    return result.value.caixa
  }
}
