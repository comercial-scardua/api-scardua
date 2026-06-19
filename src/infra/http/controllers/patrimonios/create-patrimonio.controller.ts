import {
  BadRequestException,
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
import { CreatePatrimonioUseCase } from '../../../../domain/patrimonios/application/use-cases/create-patrimonio'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const createPatrimonioBodySchema = z
  .object({
    nome: z.string().optional(),
    descricao: z.string().optional(),
    data_aquisicao: z.string().optional(),
    valor: z.string().optional(),
    status: z.string().optional(),
    fabricante: z.string().min(1),
    modelo: z.string().optional(),
    tipo: z.string().min(1),
    localizacao: z.string().min(1),
    responsavelId: z.number().int().positive(),
    numeroNotaFiscal: z.string().optional(),
    dataNotaFiscal: z.string().optional(),
    dataGarantia: z.string().optional(),
    placa: z.string().optional(),
    renavan: z.string().optional(),
    anoModelo: z.number().int().optional(),
    kmEntrega: z.string().optional(),
    locado: z.boolean().default(false),
    franquia: z.string().optional(),
    proprietario: z.string().optional(),
    segurado: z.boolean().default(false),
    seguradora: z.string().optional(),
    dataVencimentoSeguro: z.string().optional(),
    numeroLinha: z.string().optional(),
    operadora: z.string().optional(),
    numeroSerie: z.string().optional(),
  })
  .superRefine((d, ctx) => {
    if (d.tipo === 'Veículo') {
      if (!d.placa)
        ctx.addIssue({
          code: 'custom',
          path: ['placa'],
          message: 'Obrigatório para veículos',
        })
      if (!d.renavan)
        ctx.addIssue({
          code: 'custom',
          path: ['renavan'],
          message: 'Obrigatório para veículos',
        })
      if (!d.anoModelo)
        ctx.addIssue({
          code: 'custom',
          path: ['anoModelo'],
          message: 'Obrigatório para veículos',
        })
    }
    if (d.tipo === 'Linhas Telefônicas') {
      if (!d.numeroLinha)
        ctx.addIssue({
          code: 'custom',
          path: ['numeroLinha'],
          message: 'Obrigatório para linhas telefônicas',
        })
      if (!d.operadora)
        ctx.addIssue({
          code: 'custom',
          path: ['operadora'],
          message: 'Obrigatório para linhas telefônicas',
        })
    }
  })

type CreatePatrimonioBody = z.infer<typeof createPatrimonioBodySchema>

@ApiTags('Patrimônios')
@ApiBearerAuth()
@Controller('/patrimonio')
@UseGuards(PermissionsGuard)
export class CreatePatrimonioController {
  constructor(private createPatrimonio: CreatePatrimonioUseCase) {}

  @Post()
  @HttpCode(201)
  @RequirePermission('patrimonio', 'edit')
  @ApiOperation({ summary: 'Criar patrimônio' })
  @UsePipes(new ZodValidationPipe(createPatrimonioBodySchema))
  async handle(@Body() body: CreatePatrimonioBody) {
    const result = await this.createPatrimonio.execute(body)

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return { patrimonioId: result.value.patrimonioId }
  }
}
