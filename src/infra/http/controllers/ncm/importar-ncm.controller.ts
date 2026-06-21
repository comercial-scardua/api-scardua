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
import { ImportarNcmUseCase } from '../../../../domain/ncm/application/use-cases/importar-ncm'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const importarNcmBodySchema = z.object({
  itens: z.array(
    z.object({
      codigo_ncm: z.string().min(1),
      categoria_cliente: z.string().min(1),
      empresa: z.string().min(1),
      uf_emissor: z.string().length(2),
      uf_destino: z.string().length(2),
      cst_origem: z.string().optional(),
      icms_dentro: z.number().optional(),
      icms_fora: z.number().optional(),
      fora_st: z.string().optional(),
      fora_difal: z.string().optional(),
      monofasico: z.string().optional(),
      pis: z.number().optional(),
      cofins: z.number().optional(),
      ipi: z.number().optional(),
      bc_pis_cof: z.string().optional(),
      bc_icms: z.string().optional(),
      mva: z.number().optional(),
      aliquota: z.number().optional(),
      obs_fonte: z.string().optional(),
    }),
  ),
})

type ImportarNcmBody = z.infer<typeof importarNcmBodySchema>

@ApiTags('NCM')
@ApiBearerAuth()
@Controller('/ncm')
@UseGuards(PermissionsGuard)
export class ImportarNcmController {
  constructor(private importarNcm: ImportarNcmUseCase) {}

  @Post('import')
  @HttpCode(200)
  @RequirePermission('ncm', 'edit')
  @ApiOperation({ summary: 'Importar NCMs em lote (upsert)' })
  @UsePipes(new ZodValidationPipe(importarNcmBodySchema))
  async handle(
    @Body() body: ImportarNcmBody,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.importarNcm.execute(body.itens, user.email)
    return result.value
  }
}
