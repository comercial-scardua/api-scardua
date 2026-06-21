import {
  Body,
  Controller,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { CurrentUser } from '../../../../auth/decorators/current-user.decorator'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import type { JwtPayload } from '../../../../auth/types/jwt-payload.type'
import { CreateCaixaViagemUseCase } from '../../../../domain/caixa-viagem/application/use-cases/create-caixa-viagem'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const criarCaixaViagemBodySchema = z.object({
  destino: z.string().min(1),
  data: z.string(),
  empresaId: z.number().optional().nullable(),
  funcionarioId: z.number().optional().nullable(),
  veiculoId: z.number().optional().nullable(),
  numeroCaixa: z.number().optional().default(1),
  observacao: z.string().optional().nullable(),
  saldoAnterior: z.number().optional().default(0),
  oculto: z.boolean().optional().default(false),
  userId: z.string().optional().nullable(),
})

type CriarCaixaViagemBody = z.infer<typeof criarCaixaViagemBodySchema>

@ApiTags('Caixa Viagem')
@ApiBearerAuth()
@Controller('/caixaviagem')
@UseGuards(PermissionsGuard)
export class CreateParaFuncionarioController {
  constructor(private createCaixaViagem: CreateCaixaViagemUseCase) {}

  @Post('ultimo-caixa/:funcionarioId')
  @HttpCode(201)
  @RequirePermission('caixaviagem', 'edit')
  @ApiOperation({ summary: 'Criar caixa para funcionário' })
  async handle(
    @Param('funcionarioId', ParseIntPipe) funcionarioId: number,
    @Body(new ZodValidationPipe(criarCaixaViagemBodySchema))
    body: CriarCaixaViagemBody,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.createCaixaViagem.execute({
      data: { ...body, funcionarioId },
      userId: user.userId,
    })
    return result.value?.caixa
  }
}
