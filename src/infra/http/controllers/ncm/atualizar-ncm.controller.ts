import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { AtualizarNcmUseCase } from '../../../../domain/ncm/application/use-cases/atualizar-ncm'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const atualizarNcmBodySchema = z.object({
  icms_dentro: z.number().optional(),
  icms_fora: z.number().optional(),
  fora_st: z.enum(['SIM', 'Não']).optional(),
  fora_difal: z.enum(['SIM', 'Não']).optional(),
  monofasico: z.enum(['SIM', 'Não']).optional(),
  pis: z.number().optional(),
  cofins: z.number().optional(),
  ipi: z.number().optional(),
  bc_pis_cof: z.string().optional(),
  bc_icms: z.string().optional(),
  mva: z.number().optional(),
  aliquota: z.number().optional(),
  obs_fonte: z.string().optional(),
})

type AtualizarNcmBody = z.infer<typeof atualizarNcmBodySchema>

@ApiTags('NCM')
@ApiBearerAuth()
@Controller('/ncm')
@UseGuards(PermissionsGuard)
export class AtualizarNcmController {
  constructor(private atualizarNcm: AtualizarNcmUseCase) {}

  @Patch(':id')
  @HttpCode(200)
  @RequirePermission('ncm', 'edit')
  @ApiOperation({ summary: 'Atualizar campos fiscais de um NCM' })
  async handle(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(atualizarNcmBodySchema)) body: AtualizarNcmBody,
  ) {
    const result = await this.atualizarNcm.execute(id, body)

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    return result.value.ncm
  }
}
