import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { CreateLancamentosViagemForColaboradorUseCase } from '../../../../domain/lancamento-viagem/application/use-cases/create-lancamentos-viagem-for-colaborador'
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

const createForColaboradorBodySchema = z.object({
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

type CreateForColaboradorBody = z.infer<typeof createForColaboradorBodySchema>

@ApiTags('Lancamento Viagem')
@ApiBearerAuth()
@Controller('/lancamentoviagem')
@UseGuards(PermissionsGuard)
export class CreateLancamentosViagemForColaboradorController {
  constructor(
    private createForColaborador: CreateLancamentosViagemForColaboradorUseCase,
  ) {}

  @Post('usuario/:id')
  @HttpCode(201)
  @RequirePermission('lancamentoviagem', 'edit')
  @ApiOperation({
    summary: 'Criar lançamento(s) de viagem para colaborador (caixa ativo)',
  })
  async handle(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(createForColaboradorBodySchema))
    body: CreateForColaboradorBody,
  ) {
    const result = await this.createForColaborador.execute({
      colaboradorId: id,
      data: body,
    })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    return {
      success: true,
      message: `${result.value.count} lançamento(s) criado(s)`,
      lancamentos: result.value.lancamentos,
    }
  }
}
