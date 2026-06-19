import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import type { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { AtualizarColaboradorSchema } from '../../../../domain/colaboradores/application/dtos/colaborador-schema'
import { EditColaboradorUseCase } from '../../../../domain/colaboradores/application/use-cases/edit-colaborador'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

type EditColaboradorBody = z.infer<typeof AtualizarColaboradorSchema>

@ApiTags('Colaboradores')
@ApiBearerAuth()
@Controller('/colaboradores')
@UseGuards(PermissionsGuard)
export class EditColaboradorController {
  constructor(private editColaborador: EditColaboradorUseCase) {}

  @Patch(':id')
  @HttpCode(204)
  @RequirePermission('colaboradores', 'edit')
  @ApiOperation({ summary: 'Atualizar colaborador' })
  async handle(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(AtualizarColaboradorSchema))
    body: EditColaboradorBody,
  ) {
    const result = await this.editColaborador.execute({
      colaboradorId: id,
      data: body,
    })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }
  }
}
