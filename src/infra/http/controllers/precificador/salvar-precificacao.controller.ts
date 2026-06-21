import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { CurrentUser } from '../../../../auth/decorators/current-user.decorator'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import type { JwtPayload } from '../../../../auth/types/jwt-payload.type'
import { SalvarPrecificacaoUseCase } from '../../../../domain/precificador/application/use-cases/salvar-precificacao'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const salvarPrecificacaoBodySchema = z.object({
  userId: z.string().min(1),
  empresaId: z.number().int().positive(),
  empresaNome: z.string().min(1),
  produtoCodigo: z.string().min(1),
  produtoNome: z.string().min(1),
  posicaoFiscal: z.string().optional().nullable(),
  tipoPrecoBase: z.string().min(1),
  custoBase: z.number().positive(),
  custosFixosPerc: z.number().min(0),
  outrosCustosCompraPerc: z.number().min(0).default(0),
  outrosCustosVendaPerc: z.number().min(0).default(0),
  lucroPercDesejado: z.number().min(0),
  ncmCodigo: z.string().optional().nullable(),
  ncmCategoria: z.string().optional().nullable(),
  vendaFora: z.boolean().default(false),
  precoFinal: z.number().positive(),
  lucroLiquido: z.number(),
  margemLiquida: z.number(),
})

type SalvarPrecificacaoBody = z.infer<typeof salvarPrecificacaoBodySchema>

@ApiTags('Precificador')
@ApiBearerAuth()
@Controller('/precificador')
@UseGuards(PermissionsGuard)
export class SalvarPrecificacaoController {
  constructor(private salvarPrecificacao: SalvarPrecificacaoUseCase) {}

  @Post('salvar')
  @HttpCode(201)
  @RequirePermission('precificador', 'edit')
  @ApiOperation({
    summary: 'Salvar precificação (cria registro em precificador_historico)',
  })
  async handle(
    @Body(new ZodValidationPipe(salvarPrecificacaoBodySchema))
    dto: SalvarPrecificacaoBody,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.salvarPrecificacao.execute({
      ...dto,
      userId: dto.userId || user.userId,
    })
    return result.value
  }
}
