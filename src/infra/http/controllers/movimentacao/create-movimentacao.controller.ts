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
import { CurrentUser } from '../../../../auth/decorators/current-user.decorator'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import type { JwtPayload } from '../../../../auth/types/jwt-payload.type'
import { CreateMovimentacaoUseCase } from '../../../../domain/movimentacao/application/use-cases/create-movimentacao'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const createMovimentacaoBodySchema = z.object({
  patrimonioId: z.number().int(),
  tipo: z.string().min(1),
  localizacaoNova: z.string().optional(),
  responsavelNovoId: z.number().int().optional(),
  kmNovo: z.string().optional(),
})

type CreateMovimentacaoBody = z.infer<typeof createMovimentacaoBodySchema>

@ApiTags('Movimentação')
@ApiBearerAuth()
@Controller('/movimentacao')
@UseGuards(PermissionsGuard)
export class CreateMovimentacaoController {
  constructor(private createMovimentacao: CreateMovimentacaoUseCase) {}

  @Post()
  @HttpCode(201)
  @RequirePermission('movimentacao', 'edit')
  @ApiOperation({
    summary: 'Criar movimentação (preenche dados anteriores automaticamente)',
  })
  @UsePipes(new ZodValidationPipe(createMovimentacaoBodySchema))
  async handle(
    @Body() body: CreateMovimentacaoBody,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.createMovimentacao.execute({
      data: body,
      autorId: user?.userId ? Number(user.userId) : undefined,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return { movimentacaoId: result.value.movimentacao.id }
  }
}
