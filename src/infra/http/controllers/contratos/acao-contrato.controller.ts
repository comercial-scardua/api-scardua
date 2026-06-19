import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { AcaoContratoUseCase } from '../../../../domain/contratos/application/use-cases/acao-contrato'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const acaoContratoBodySchema = z.object({
  action: z.enum(['finalizar', 'renovar']),
})

type AcaoContratoBody = z.infer<typeof acaoContratoBodySchema>

@ApiTags('Contratos')
@ApiBearerAuth()
@Controller('/contratos')
@UseGuards(PermissionsGuard)
export class AcaoContratoController {
  constructor(private acaoContrato: AcaoContratoUseCase) {}

  @Patch(':id')
  @HttpCode(200)
  @RequirePermission('contratos', 'edit')
  @ApiOperation({ summary: 'Ações: finalizar (toggle) ou renovar (+30 dias)' })
  @UsePipes(new ZodValidationPipe(acaoContratoBodySchema))
  async handle(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: AcaoContratoBody,
  ) {
    const result = await this.acaoContrato.execute({
      contratoId: id,
      acao: body.action,
    })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    return { contrato: result.value.contrato }
  }
}
