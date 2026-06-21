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
import { CreateLancamentosForUserUseCase } from '../../../../domain/lancamento/application/use-cases/create-lancamentos-for-user'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const lancamentoItemSchema = z.object({
  data: z.string().min(1),
  numeroDocumento: z.string().optional().nullable(),
  observacao: z.string().optional().default(''),
  credito: z.string().optional().nullable(),
  debito: z.string().optional().nullable(),
})

const createLancamentosForUserBodySchema = z.object({
  clearExisting: z.boolean().optional().default(false),
  lancamentos: z.array(lancamentoItemSchema).optional(),
  data: z.string().optional(),
  numeroDocumento: z.string().optional().nullable(),
  observacao: z.string().optional().default(''),
  credito: z.string().optional().nullable(),
  debito: z.string().optional().nullable(),
})

type CreateLancamentosForUserBody = z.infer<
  typeof createLancamentosForUserBodySchema
>

@ApiTags('Lancamento')
@ApiBearerAuth()
@Controller('/lancamento')
@UseGuards(PermissionsGuard)
export class CreateLancamentosForUserController {
  constructor(
    private createLancamentosForUser: CreateLancamentosForUserUseCase,
  ) {}

  @Post('usuario/:id')
  @HttpCode(201)
  @RequirePermission('lancamento', 'edit')
  @ApiOperation({
    summary: 'Criar lançamento(s) para um usuário (por colaboradorId)',
  })
  async handle(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(createLancamentosForUserBodySchema))
    body: CreateLancamentosForUserBody,
  ) {
    const result = await this.createLancamentosForUser.execute({
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
