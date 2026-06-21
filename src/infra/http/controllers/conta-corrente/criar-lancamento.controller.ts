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
import { CriarLancamentoContaUseCase } from '../../../../domain/conta-corrente/application/use-cases/criar-lancamento-conta'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const criarLancamentoBodySchema = z.object({
  data: z.string(),
  numeroDocumento: z.string().optional(),
  observacao: z.string().default(''),
  credito: z.string().optional(),
  debito: z.string().optional(),
})

type CriarLancamentoBody = z.infer<typeof criarLancamentoBodySchema>

@ApiTags('Conta Corrente')
@ApiBearerAuth()
@Controller('/conta-corrente')
@UseGuards(PermissionsGuard)
export class CriarLancamentoController {
  constructor(private criarLancamento: CriarLancamentoContaUseCase) {}

  @Post(':id/lancamentos')
  @HttpCode(201)
  @RequirePermission('contacorrente', 'access')
  @ApiOperation({ summary: 'Adicionar lançamento à conta' })
  async handle(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(criarLancamentoBodySchema))
    body: CriarLancamentoBody,
  ) {
    const result = await this.criarLancamento.execute({
      contaId: id,
      data: body,
    })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    return result.value.lancamento
  }
}
