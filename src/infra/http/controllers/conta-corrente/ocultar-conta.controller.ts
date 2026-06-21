import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { ToggleOcultoContaUseCase } from '../../../../domain/conta-corrente/application/use-cases/toggle-oculto-conta'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const ocultarBodySchema = z.object({
  id: z.number().int().positive(),
})

type OcultarBody = z.infer<typeof ocultarBodySchema>

@ApiTags('Conta Corrente')
@ApiBearerAuth()
@Controller('/conta-corrente')
@UseGuards(PermissionsGuard)
export class OcultarContaController {
  constructor(private toggleOculto: ToggleOcultoContaUseCase) {}

  @Post('ocultar')
  @HttpCode(200)
  @RequirePermission('contacorrente', 'access')
  @ApiOperation({ summary: 'Ocultar/exibir conta corrente por ID (via body)' })
  async handle(
    @Body(new ZodValidationPipe(ocultarBodySchema)) body: OcultarBody,
  ) {
    const result = await this.toggleOculto.execute({ id: body.id })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    return result.value.conta
  }
}
