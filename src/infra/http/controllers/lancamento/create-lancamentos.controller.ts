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
import { CreateLancamentosUseCase } from '../../../../domain/lancamento/application/use-cases/create-lancamentos'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const lancamentoItemSchema = z.object({
  data: z.string().min(1),
  numeroDocumento: z.string().optional().nullable(),
  observacao: z.string().optional().default(''),
  credito: z.string().optional().nullable(),
  debito: z.string().optional().nullable(),
})

const createLancamentosBodySchema = z.object({
  contaCorrenteId: z.number().int().positive(),
  clearExisting: z.boolean().optional().default(false),
  lancamentos: z.array(lancamentoItemSchema).optional(),
  data: z.string().optional(),
  numeroDocumento: z.string().optional().nullable(),
  observacao: z.string().optional().default(''),
  credito: z.string().optional().nullable(),
  debito: z.string().optional().nullable(),
})

type CreateLancamentosBody = z.infer<typeof createLancamentosBodySchema>

@ApiTags('Lancamento')
@ApiBearerAuth()
@Controller('/lancamento')
@UseGuards(PermissionsGuard)
export class CreateLancamentosController {
  constructor(private createLancamentos: CreateLancamentosUseCase) {}

  @Post()
  @HttpCode(201)
  @RequirePermission('lancamento', 'edit')
  @ApiOperation({
    summary: 'Criar lançamento(s) — suporta formato bulk com lancamentos[]',
  })
  @UsePipes(new ZodValidationPipe(createLancamentosBodySchema))
  async handle(@Body() body: CreateLancamentosBody) {
    const result = await this.createLancamentos.execute({ data: body })

    return {
      success: true,
      message: `${result.value.count} lançamento(s) criado(s)`,
      lancamentos: result.value.lancamentos,
    }
  }
}
