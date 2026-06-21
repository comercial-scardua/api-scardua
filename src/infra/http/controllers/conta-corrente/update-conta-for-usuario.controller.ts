import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { UpdateContaCorrenteUseCase } from '../../../../domain/conta-corrente/application/use-cases/update-conta-corrente'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const updateContaForUsuarioBodySchema = z.object({
  id: z.number().int().positive(),
  data: z.string().optional(),
  tipo: z.string().optional(),
  fornecedorCliente: z.string().optional(),
  observacao: z.string().optional(),
  setor: z.string().optional(),
  empresaId: z.number().int().positive().optional().nullable(),
  colaboradorId: z.number().int().positive().optional().nullable(),
  oculto: z.boolean().optional(),
})

type UpdateContaForUsuarioBody = z.infer<typeof updateContaForUsuarioBodySchema>

@ApiTags('Conta Corrente')
@ApiBearerAuth()
@Controller('/conta-corrente')
@UseGuards(PermissionsGuard)
export class UpdateContaForUsuarioController {
  constructor(private updateConta: UpdateContaCorrenteUseCase) {}

  @Put('usuario/:userId')
  @HttpCode(200)
  @RequirePermission('contacorrente', 'access')
  @ApiOperation({
    summary: 'Atualizar conta corrente de um usuário (id no body)',
  })
  async handle(
    @Param('userId') _userId: string,
    @Body(new ZodValidationPipe(updateContaForUsuarioBodySchema))
    body: UpdateContaForUsuarioBody,
  ) {
    const { id, ...data } = body
    const result = await this.updateConta.execute({ id, data })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    return result.value.conta
  }
}
