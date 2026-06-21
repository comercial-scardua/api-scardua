import {
  Body,
  ConflictException,
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
import { CriarNcmUseCase } from '../../../../domain/ncm/application/use-cases/criar-ncm'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const criarNcmBodySchema = z.object({
  codigo_ncm: z.string().min(1),
  categoria_cliente: z.string().min(1),
  empresa: z.string().min(1),
  uf_emissor: z.string().length(2),
  uf_destino: z.string().length(2),
  cst_origem: z.string().default(''),
  icms_dentro: z.number().default(0),
  icms_fora: z.number().default(0),
  fora_st: z.enum(['SIM', 'Não']).default('Não'),
  fora_difal: z.enum(['SIM', 'Não']).default('Não'),
  monofasico: z.enum(['SIM', 'Não']).default('Não'),
  pis: z.number().default(0),
  cofins: z.number().default(0),
  ipi: z.number().default(0),
  bc_pis_cof: z.string().default(''),
  bc_icms: z.string().default(''),
  mva: z.number().default(0),
  aliquota: z.number().default(0),
  obs_fonte: z.string().optional(),
})

type CriarNcmBody = z.infer<typeof criarNcmBodySchema>

@ApiTags('NCM')
@ApiBearerAuth()
@Controller('/ncm')
@UseGuards(PermissionsGuard)
export class CriarNcmController {
  constructor(private criarNcm: CriarNcmUseCase) {}

  @Post()
  @HttpCode(201)
  @RequirePermission('ncm', 'edit')
  @ApiOperation({ summary: 'Criar NCM' })
  @UsePipes(new ZodValidationPipe(criarNcmBodySchema))
  async handle(
    @Body() body: CriarNcmBody,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.criarNcm.execute(body, user.email)

    if (result.isLeft()) {
      throw new ConflictException(result.value.message)
    }

    return result.value.ncm
  }
}
