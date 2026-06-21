import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { ColaboradorNaoEncontradoBancoHorasError } from '../../../../domain/banco-horas/application/use-cases/errors/colaborador-nao-encontrado.error'
import { RegistrarPontoUseCase } from '../../../../domain/banco-horas/application/use-cases/registrar-ponto.use-case'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const registrarPontoBodySchema = z.object({
  colaboradorId: z.number().int().positive(),
  tipo: z.enum([
    'ENTRADA',
    'SAIDA',
    'INTERVALO_INICIO',
    'INTERVALO_FIM',
    'AJUSTE',
  ]),
  data: z.coerce.date(),
  horaInicio: z
    .string()
    .regex(/^\d{2}:\d{2}$/)
    .optional(),
  horaFim: z
    .string()
    .regex(/^\d{2}:\d{2}$/)
    .optional(),
  intervaloMinutos: z.number().int().min(0).optional(),
  horasCorrigidas: z.number().min(0).optional(),
  acao: z.string().optional(),
  observacao: z.string().optional(),
})

type RegistrarPontoBody = z.infer<typeof registrarPontoBodySchema>

@ApiTags('Banco de Horas')
@ApiBearerAuth()
@Controller('/banco-de-horas')
@UseGuards(PermissionsGuard)
export class RegistrarPontoController {
  constructor(private registrarPontoUseCase: RegistrarPontoUseCase) {}

  @Post('registros')
  @HttpCode(201)
  @RequirePermission('banco-horas', 'edit')
  @ApiOperation({ summary: 'Registrar entrada/saída (folha de ponto)' })
  @UsePipes(new ZodValidationPipe(registrarPontoBodySchema))
  async handle(@Body() body: RegistrarPontoBody) {
    const result = await this.registrarPontoUseCase.execute(body)

    if (result.isLeft()) {
      const error = result.value
      if (error instanceof ColaboradorNaoEncontradoBancoHorasError) {
        throw new NotFoundException(error.message)
      }
      throw new BadRequestException((error as Error).message)
    }

    return (result.value as any).registro
  }
}
