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
import { CurrentUser } from '../../../../auth/decorators/current-user.decorator'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import type { JwtPayload } from '../../../../auth/types/jwt-payload.type'
import { CriarSaidaUseCase } from '../../../../domain/estoque/application/use-cases/criar-saida'
import { SaldoInsuficienteError } from '../../../../domain/estoque/application/use-cases/errors/saldo-insuficiente.error'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const criarSaidaSchema = z.object({
  produtoId: z.number().int().positive(),
  quantidade: z.number().int().positive('Quantidade deve ser maior que zero'),
  dataSaida: z.string(),
  responsavel: z.string().min(1),
  motivo: z.string().optional(),
  observacoes: z.string().optional(),
  empresaId: z.number().int().positive().optional().nullable(),
})

type CriarSaidaBody = z.infer<typeof criarSaidaSchema>

@ApiTags('Estoque')
@ApiBearerAuth()
@Controller('/estoque')
@UseGuards(PermissionsGuard)
export class CreateSaidaController {
  constructor(private criarSaida: CriarSaidaUseCase) {}

  @Post('saidas')
  @HttpCode(201)
  @RequirePermission('estoque', 'edit')
  @ApiOperation({
    summary: 'Registrar saída (valida saldo + transação atômica)',
  })
  @UsePipes(new ZodValidationPipe(criarSaidaSchema))
  async handle(@Body() body: CriarSaidaBody, @CurrentUser() user: JwtPayload) {
    const result = await this.criarSaida.execute(body, user.userId)

    if (result.isLeft()) {
      if (result.value instanceof SaldoInsuficienteError) {
        throw new BadRequestException(result.value.message)
      }
      throw new NotFoundException(result.value.message)
    }

    return result.value.saida
  }
}
