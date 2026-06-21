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
import { UpsertMonitorRegistroUseCase } from '../../../../domain/monitor-registros/application/use-cases/upsert-monitor-registro'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const upsertMonitorBodySchema = z.object({
  colaboradorId: z.number().int().positive(),
  tipo: z.string().min(1),
  data: z.string().min(1),
  horaEntrada: z.string().optional(),
  horaSaida: z.string().optional(),
  observacao: z.string().optional(),
})

type UpsertMonitorBody = z.infer<typeof upsertMonitorBodySchema>

@ApiTags('Monitor Registros')
@ApiBearerAuth()
@Controller('/monitor-registros')
@UseGuards(PermissionsGuard)
export class UpsertMonitorRegistroController {
  constructor(private upsertMonitorRegistro: UpsertMonitorRegistroUseCase) {}

  @Post()
  @HttpCode(201)
  @RequirePermission('monitor-registros', 'edit')
  @ApiOperation({ summary: 'Registrar/atualizar entrada de monitoramento' })
  @UsePipes(new ZodValidationPipe(upsertMonitorBodySchema))
  async handle(@Body() body: UpsertMonitorBody) {
    const result = await this.upsertMonitorRegistro.execute({
      colaboradorId: body.colaboradorId,
      tipo: body.tipo,
      data: body.data,
      horaEntrada: body.horaEntrada,
      horaSaida: body.horaSaida,
      observacao: body.observacao,
    })

    return result.value
  }
}
