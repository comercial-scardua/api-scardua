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
export class CreateParaUsuarioController {
  constructor(private createCaixaViagem: CreateCaixaViagemUseCase) {}

  @Post('usuario/:id')
  @HttpCode(201)
  @RequirePermission('caixaviagem', 'edit')
  @ApiOperation({ summary: 'Criar caixa de viagem para usuário específico' })
  async handle(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(criarCaixaViagemBodySchema))
    body: CriarCaixaViagemBody,
  ) {
    const result = await this.createCaixaViagem.execute({
      data: { ...body, userId: id },
      userId: id,
    })
    return result.value?.caixa
  }
}
