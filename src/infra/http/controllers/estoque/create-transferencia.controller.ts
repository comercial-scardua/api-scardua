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
import { CriarTransferenciaUseCase } from '../../../../domain/estoque/application/use-cases/criar-transferencia'
import { SaldoInsuficienteError } from '../../../../domain/estoque/application/use-cases/errors/saldo-insuficiente.error'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const criarTransferenciaSchema = z
  .object({
    produtoId: z.number().int().positive(),
    empresaOrigemId: z.number().int().positive(),
    empresaDestinoId: z.number().int().positive(),
    quantidade: z.number().int().positive('Quantidade deve ser maior que zero'),
    dataTransferencia: z.string(),
    responsavel: z.string().min(1),
    observacoes: z.string().optional(),
  })
  .refine((d) => d.empresaOrigemId !== d.empresaDestinoId, {
    message: 'Empresa de origem e destino devem ser diferentes',
    path: ['empresaDestinoId'],
  })

type CriarTransferenciaBody = z.infer<typeof criarTransferenciaSchema>

@ApiTags('Estoque')
@ApiBearerAuth()
@Controller('/estoque')
@UseGuards(PermissionsGuard)
export class CreateTransferenciaController {
  constructor(private criarTransferencia: CriarTransferenciaUseCase) {}

  @Post('transferencias')
  @HttpCode(201)
  @RequirePermission('estoque', 'edit')
  @ApiOperation({
    summary: 'Transferir estoque entre filiais (valida saldo na origem)',
  })
  @UsePipes(new ZodValidationPipe(criarTransferenciaSchema))
  async handle(
    @Body() body: CriarTransferenciaBody,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.criarTransferencia.execute(body, user.userId)

    if (result.isLeft()) {
      if (result.value instanceof SaldoInsuficienteError) {
        throw new BadRequestException(result.value.message)
      }
      throw new NotFoundException(result.value.message)
    }

    return result.value.transferencia
  }
}
