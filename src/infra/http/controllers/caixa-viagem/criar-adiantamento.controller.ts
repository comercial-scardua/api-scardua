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
import { CurrentUser } from '../../../../auth/decorators/current-user.decorator'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import type { JwtPayload } from '../../../../auth/types/jwt-payload.type'
import { CriarAdiantamentoUseCase } from '../../../../domain/caixa-viagem/application/use-cases/criar-adiantamento'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const criarAdiantamentoBodySchema = z.object({
  data: z.string(),
  saida: z.string(),
  observacao: z.string().optional().nullable(),
  nome: z.string().min(1),
  caixaViagemId: z.number().optional().nullable(),
  colaboradorId: z.number().optional().nullable(),
  userId: z.string().optional().nullable(),
  oculto: z.boolean().optional().default(false),
})

type CriarAdiantamentoBody = z.infer<typeof criarAdiantamentoBodySchema>

@ApiTags('Caixa Viagem')
@ApiBearerAuth()
@Controller('/caixaviagem')
@UseGuards(PermissionsGuard)
export class CriarAdiantamentoController {
  constructor(private criarAdiantamento: CriarAdiantamentoUseCase) {}

  @Post('adiantamento')
  @HttpCode(201)
  @RequirePermission('caixaviagem', 'edit')
  @ApiOperation({ summary: 'Criar adiantamento' })
  @UsePipes(new ZodValidationPipe(criarAdiantamentoBodySchema))
  async handle(
    @Body() body: CriarAdiantamentoBody,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.criarAdiantamento.execute({
      data: {
        ...body,
        userId: body.userId ?? user.userId,
      },
    })
    return result.value?.adiantamento
  }
}
