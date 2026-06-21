import {
  Body,
  Controller,
  HttpCode,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { EpiRepository } from '../../../../domain/epi/application/repositories/epi-repository'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const criarEpiBodySchema = z.object({
  nome: z.string().min(1),
  codigo: z.string().min(1),
  ca: z.string().min(1),
  categoria: z.string().min(1),
  tamanho: z.string().optional(),
  fabricante: z.string().min(1),
  vida_util_dias: z.number().int().positive(),
  estoque_inicial: z.number().int().min(0).default(0),
  estoque_minimo: z.number().int().min(0).default(0),
  observacoes: z.string().optional(),
})

type CriarEpiBody = z.infer<typeof criarEpiBodySchema>

@ApiTags('EPI')
@ApiBearerAuth()
@Controller('/epi')
@UseGuards(PermissionsGuard)
export class CreateEpiController {
  constructor(private repo: EpiRepository) {}

  @Post('epis')
  @HttpCode(201)
  @RequirePermission('epi', 'edit')
  @ApiOperation({ summary: 'Cadastrar EPI' })
  @ApiQuery({ name: 'empresaId', required: false, type: Number })
  @UsePipes(new ZodValidationPipe(criarEpiBodySchema))
  handle(@Body() body: CriarEpiBody, @Query('empresaId') empresaId?: string) {
    return this.repo.createEpi(body, empresaId ? Number(empresaId) : undefined)
  }
}
