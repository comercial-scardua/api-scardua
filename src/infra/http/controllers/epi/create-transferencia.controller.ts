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
import { CriarTransferenciaEpiUseCase } from '../../../../domain/epi/application/use-cases/criar-transferencia-epi'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const criarTransferenciaBodySchema = z
  .object({
    produtoId: z.number().int().positive(),
    empresaOrigemId: z.number().int().positive(),
    empresaDestinoId: z.number().int().positive(),
    quantidade: z.number().int().positive(),
    dataTransferencia: z.string().min(1),
    responsavel: z.string().min(1),
    observacoes: z.string().optional(),
  })
  .refine((d) => d.empresaOrigemId !== d.empresaDestinoId, {
    message: 'Origem e destino devem ser diferentes',
    path: ['empresaDestinoId'],
  })

type CriarTransferenciaBody = z.infer<typeof criarTransferenciaBodySchema>

@ApiTags('EPI')
@ApiBearerAuth()
@Controller('/epi')
@UseGuards(PermissionsGuard)
export class CreateTransferenciaController {
  constructor(private criarTransferencia: CriarTransferenciaEpiUseCase) {}

  @Post('transferencias')
  @HttpCode(201)
  @RequirePermission('epi', 'edit')
  @ApiOperation({ summary: 'Criar transferência de EPI entre filiais' })
  @UsePipes(new ZodValidationPipe(criarTransferenciaBodySchema))
  async handle(@Body() body: CriarTransferenciaBody) {
    const result = await this.criarTransferencia.execute(body)
    if (result.isLeft()) throw new BadRequestException(result.value.message)
    return result.value.transferencia
  }
}
