import {
  Body,
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
import { CreateLancamentosViagemUseCase } from '../../../../domain/lancamento-viagem/application/use-cases/create-lancamentos-viagem'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const lancamentoViagemItemSchema = z.object({
  data: z.string().min(1),
  custo: z.string().min(1),
  clienteFornecedor: z.string().min(1),
  entrada: z.string().optional().nullable(),
  saida: z.string().optional().nullable(),
  numeroDocumento: z.string().optional().nullable(),
  historicoDoc: z.string().optional().nullable(),
})

const createLancamentosViagemBodySchema = z.object({
  caixaViagemId: z.number().int().positive().optional().nullable(),
  clearExisting: z.boolean().optional().default(false),
  lancamentos: z.array(lancamentoViagemItemSchema).optional(),
  data: z.string().optional(),
  custo: z.string().optional(),
  clienteFornecedor: z.string().optional(),
  entrada: z.string().optional().nullable(),
  saida: z.string().optional().nullable(),
  numeroDocumento: z.string().optional().nullable(),
  historicoDoc: z.string().optional().nullable(),
})

type CreateLancamentosViagemBody = z.infer<
  typeof createLancamentosViagemBodySchema
>

@ApiTags('Lancamento Viagem')
@ApiBearerAuth()
@Controller('/lancamentoviagem')
@UseGuards(PermissionsGuard)
export class CreateLancamentosViagemController {
  constructor(
    private createLancamentosViagem: CreateLancamentosViagemUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @RequirePermission('lancamentoviagem', 'edit')
  @ApiOperation({
    summary:
      'Criar lançamento(s) de viagem — suporta formato bulk com lancamentos[]',
  })
  @UsePipes(new ZodValidationPipe(createLancamentosViagemBodySchema))
  async handle(@Body() body: CreateLancamentosViagemBody) {
    const result = await this.createLancamentosViagem.execute({ data: body })

    return {
      success: true,
      message: `${result.value.count} lançamento(s) criado(s)`,
      lancamentos: result.value.lancamentos,
    }
  }
}
