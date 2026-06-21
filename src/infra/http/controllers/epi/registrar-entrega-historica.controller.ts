import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { RegistrarEntregaHistoricaUseCase } from '../../../../domain/epi/application/use-cases/registrar-entrega-historica'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const registrarEntregaBodySchema = z.object({
  colaborador_id: z.number().int().positive(),
  epi_id: z.number().int().positive(),
  quantidade: z.number().int().positive().default(1),
  data_movimentacao: z.string().min(1),
  responsavel: z.string().min(1),
  empresaId: z.number().int().positive().optional(),
  motivo: z.string().optional(),
  observacoes: z.string().optional(),
})

type RegistrarEntregaBody = z.infer<typeof registrarEntregaBodySchema>

@ApiTags('EPI')
@ApiBearerAuth()
@Controller('/epi')
@UseGuards(PermissionsGuard)
export class RegistrarEntregaHistoricaController {
  constructor(private historicaUseCase: RegistrarEntregaHistoricaUseCase) {}

  @Post('movimentacoes/entrega-historica')
  @HttpCode(201)
  @RequirePermission('epi', 'edit')
  @ApiOperation({
    summary: 'Registrar entrega histórica (NÃO desconta estoque)',
  })
  @UsePipes(new ZodValidationPipe(registrarEntregaBodySchema))
  async handle(@Body() body: RegistrarEntregaBody) {
    const result = await this.historicaUseCase.execute(body)
    if (result.isLeft()) throw new NotFoundException(result.value.message)
    return result.value.movimentacao
  }
}
