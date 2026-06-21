import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { EpiRepository } from '../../../../domain/epi/application/repositories/epi-repository'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const atualizarColaboradorBodySchema = z.object({
  epiCargoId: z.number().int().positive().nullable().optional(),
  gestorId: z.number().int().positive().nullable().optional(),
  epiObservacoes: z.string().optional(),
})

type AtualizarColaboradorBody = z.infer<typeof atualizarColaboradorBodySchema>

@ApiTags('EPI')
@ApiBearerAuth()
@Controller('/epi')
@UseGuards(PermissionsGuard)
export class UpdateColaboradorController {
  constructor(private repo: EpiRepository) {}

  @Put('colaboradores/:id')
  @RequirePermission('epi', 'edit')
  @ApiOperation({
    summary: 'Atualizar cargo/gestor/observações EPI do colaborador',
  })
  handle(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(atualizarColaboradorBodySchema))
    body: AtualizarColaboradorBody,
  ) {
    return this.repo.updateColaboradorEpi(id, body)
  }
}
