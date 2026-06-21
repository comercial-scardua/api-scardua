import {
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { CreateContaCorrenteUseCase } from '../../../../domain/conta-corrente/application/use-cases/create-conta-corrente'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const createContaBodySchema = z.object({
  data: z.string().optional(),
  tipo: z.string().default('EXTRA_CAIXA'),
  fornecedorCliente: z.string().default(''),
  observacao: z.string().default(''),
  setor: z.string().default(''),
  empresaId: z.number().int().positive().optional().nullable(),
  colaboradorId: z.number().int().positive().optional().nullable(),
  oculto: z.boolean().default(false),
})

type CreateContaBody = z.infer<typeof createContaBodySchema>

@ApiTags('Conta Corrente')
@ApiBearerAuth()
@Controller('/conta-corrente')
@UseGuards(PermissionsGuard)
export class CreateContaForUsuarioController {
  constructor(private createConta: CreateContaCorrenteUseCase) {}

  @Post('usuario/:userId')
  @HttpCode(201)
  @RequirePermission('contacorrente', 'access')
  @ApiOperation({ summary: 'Criar conta corrente para um usuário específico' })
  async handle(
    @Param('userId') userId: string,
    @Body(new ZodValidationPipe(createContaBodySchema)) body: CreateContaBody,
  ) {
    const result = await this.createConta.execute({ data: body, userId })
    return result.value.conta
  }
}
