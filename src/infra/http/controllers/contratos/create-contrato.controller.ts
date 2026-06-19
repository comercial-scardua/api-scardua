import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { CreateContratoUseCase } from '../../../../domain/contratos/application/use-cases/create-contrato'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const createContratoBodySchema = z
  .object({
    numero: z.string().min(1),
    titulo: z.string().min(1),
    fornecedor: z.string().min(1),
    valor: z.number().positive('Valor deve ser maior que zero'),
    data_inicio: z.string().min(1),
    data_vencimento: z.string().optional(),
    vencimento_indeterminado: z.boolean().default(false),
    departamento: z.string().min(1),
    responsavel: z.string().min(1),
    descricao: z.string().optional(),
    tipo_contrato: z.string().default('prestacao_servico'),
    renovacao_automatica: z.boolean().optional().default(false),
    alertas_ativos: z.boolean().optional().default(true),
    observacao: z.string().optional(),
  })
  .refine((d) => d.vencimento_indeterminado || !!d.data_vencimento, {
    message:
      'data_vencimento obrigatória quando vencimento não é indeterminado',
    path: ['data_vencimento'],
  })

type CreateContratoBody = z.infer<typeof createContratoBodySchema>

@ApiTags('Contratos')
@ApiBearerAuth()
@Controller('/contratos')
@UseGuards(PermissionsGuard)
export class CreateContratoController {
  constructor(private createContrato: CreateContratoUseCase) {}

  @Post()
  @HttpCode(201)
  @RequirePermission('contratos', 'edit')
  @ApiOperation({ summary: 'Criar contrato' })
  @UsePipes(new ZodValidationPipe(createContratoBodySchema))
  async handle(@Body() body: CreateContratoBody) {
    const result = await this.createContrato.execute(body)

    if (result.isLeft()) {
      throw new ConflictException(result.value.message)
    }

    return { contratoId: result.value.contrato.id }
  }
}
