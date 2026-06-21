import {
  Body,
  Controller,
  NotFoundException,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { AtualizarEpiUseCase } from '../../../../domain/epi/application/use-cases/atualizar-epi'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const atualizarEpiBodySchema = z.object({
  nome: z.string().min(1).optional(),
  ca: z.string().min(1).optional(),
  categoria: z.string().min(1).optional(),
  tamanho: z.string().optional(),
  fabricante: z.string().min(1).optional(),
  vida_util_dias: z.number().int().positive().optional(),
  estoque_minimo: z.number().int().min(0).optional(),
  status: z.enum(['ATIVO', 'INATIVO']).optional(),
  observacoes: z.string().optional(),
})

type AtualizarEpiBody = z.infer<typeof atualizarEpiBodySchema>

@ApiTags('EPI')
@ApiBearerAuth()
@Controller('/epi')
@UseGuards(PermissionsGuard)
export class UpdateEpiController {
  constructor(private atualizarEpi: AtualizarEpiUseCase) {}

  @Put('epis/:id')
  @RequirePermission('epi', 'edit')
  @ApiOperation({ summary: 'Atualizar EPI' })
  async handle(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(atualizarEpiBodySchema)) body: AtualizarEpiBody,
  ) {
    const result = await this.atualizarEpi.execute(id, body)
    if (result.isLeft()) throw new NotFoundException(result.value.message)
    return result.value.epi
  }
}
