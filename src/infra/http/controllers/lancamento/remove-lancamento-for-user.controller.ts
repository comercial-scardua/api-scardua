import {
  Body,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { RemoveLancamentoForUserUseCase } from '../../../../domain/lancamento/application/use-cases/remove-lancamento-for-user'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const removeLancamentoForUserBodySchema = z.object({
  lancamentoId: z.number().int().positive(),
})

type RemoveLancamentoForUserBody = z.infer<
  typeof removeLancamentoForUserBodySchema
>

@ApiTags('Lancamento')
@ApiBearerAuth()
@Controller('/lancamento')
@UseGuards(PermissionsGuard)
export class RemoveLancamentoForUserController {
  constructor(
    private removeLancamentoForUser: RemoveLancamentoForUserUseCase,
  ) {}

  @Delete('usuario/:id')
  @HttpCode(204)
  @RequirePermission('lancamento', 'edit')
  @ApiOperation({ summary: 'Excluir lançamento de um usuário' })
  async handle(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(removeLancamentoForUserBodySchema))
    body: RemoveLancamentoForUserBody,
  ) {
    const result = await this.removeLancamentoForUser.execute({
      colaboradorId: id,
      lancamentoId: body.lancamentoId,
    })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }
  }
}
