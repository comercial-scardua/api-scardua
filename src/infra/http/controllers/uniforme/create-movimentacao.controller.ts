import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  UnprocessableEntityException,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { CreateMovimentacaoUseCase } from '../../../../domain/uniforme/application/use-cases/create-movimentacao'
import { UniformeNaoEncontradoError } from '../../../../domain/uniforme/application/use-cases/errors/uniforme-nao-encontrado.error'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const createMovimentacaoBodySchema = z.object({
  colaborador_id: z.coerce.number().int().positive(),
  uniforme_id: z.coerce.number().int().positive(),
  tipo: z
    .enum(['ENTREGA', 'DEVOLUCAO', 'TROCA', 'PERDA', 'BAIXA'])
    .optional()
    .nullable(),
  quantidade: z.coerce.number().int().positive(),
  data_movimentacao: z.string().min(1),
  responsavel: z.string().min(1),
  proxima_entrega: z.string().optional().nullable(),
  motivo: z.string().optional().nullable(),
  observacoes: z.string().optional().nullable(),
  empresaId: z.coerce.number().int().positive().optional().nullable(),
})

type CreateMovimentacaoBody = z.infer<typeof createMovimentacaoBodySchema>

@ApiTags('Uniforme')
@ApiBearerAuth()
@Controller('/uniforme/movimentacoes')
@UseGuards(PermissionsGuard)
export class CreateMovimentacaoController {
  constructor(private createMovimentacao: CreateMovimentacaoUseCase) {}

  @Post()
  @HttpCode(201)
  @RequirePermission('uniforme', 'edit')
  @ApiOperation({ summary: 'Registrar movimentação de uniforme' })
  @UsePipes(new ZodValidationPipe(createMovimentacaoBodySchema))
  async handle(@Body() body: CreateMovimentacaoBody) {
    const result = await this.createMovimentacao.execute(body)

    if (result.isLeft()) {
      const error = result.value
      if (error instanceof UniformeNaoEncontradoError) {
        throw new NotFoundException(error.message)
      }
      throw new UnprocessableEntityException(error.message)
    }

    return result.value
  }
}
