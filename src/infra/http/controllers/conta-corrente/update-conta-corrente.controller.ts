import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { UpdateContaCorrenteUseCase } from '../../../../domain/conta-corrente/application/use-cases/update-conta-corrente'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const updateContaBodySchema = z.object({
  data: z.string().optional(),
  tipo: z.string().optional(),
  fornecedorCliente: z.string().optional(),
  observacao: z.string().optional(),
  setor: z.string().optional(),
  empresaId: z.number().int().positive().optional().nullable(),
  colaboradorId: z.number().int().positive().optional().nullable(),
  oculto: z.boolean().optional(),
})

type UpdateContaBody = z.infer<typeof updateContaBodySchema>

@ApiTags('Conta Corrente')
@ApiBearerAuth()
@Controller('/conta-corrente')
@UseGuards(PermissionsGuard)
export class UpdateContaCorrenteController {
  constructor(private updateConta: UpdateContaCorrenteUseCase) {}

  @Patch(':id')
  @HttpCode(200)
  @RequirePermission('contacorrente', 'access')
  @ApiOperation({ summary: 'Atualizar conta corrente' })
  async handle(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateContaBodySchema)) body: UpdateContaBody,
  ) {
    const result = await this.updateConta.execute({ id, data: body })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    return result.value.conta
  }
}
