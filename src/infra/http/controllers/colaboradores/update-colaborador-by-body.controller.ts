import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Put,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { AtualizarColaboradorSchema } from '../../../../domain/colaboradores/application/dtos/colaborador-schema'
import { EditColaboradorUseCase } from '../../../../domain/colaboradores/application/use-cases/edit-colaborador'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const updateByBodySchema = AtualizarColaboradorSchema.extend({
  id: z.number().int().positive(),
})

type UpdateByBody = z.infer<typeof updateByBodySchema>

@ApiTags('Colaboradores')
@ApiBearerAuth()
@Controller('/colaboradores')
@UseGuards(PermissionsGuard)
export class UpdateColaboradorByBodyController {
  constructor(private editColaborador: EditColaboradorUseCase) {}

  @Put()
  @HttpCode(204)
  @RequirePermission('colaboradores', 'edit')
  @ApiOperation({
    summary: 'Atualizar colaborador (id no body — padrão legado)',
  })
  async handle(
    @Body(new ZodValidationPipe(updateByBodySchema)) body: UpdateByBody,
  ) {
    const { id, ...data } = body
    const result = await this.editColaborador.execute({
      colaboradorId: id,
      data,
    })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }
  }
}
