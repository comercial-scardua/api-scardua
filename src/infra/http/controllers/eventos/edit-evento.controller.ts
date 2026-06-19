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
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { EditEventoUseCase } from '../../../../domain/eventos/application/use-cases/edit-evento'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const editEventoBodySchema = z.object({
  tipo: z.string().min(1).optional(),
  titulo: z.string().min(1).optional(),
  descricao: z.string().nullish(),
  dataInicio: z
    .union([z.string(), z.date()])
    .transform((v) => new Date(v))
    .optional(),
  dataFim: z
    .union([z.string(), z.date()])
    .transform((v) => new Date(v))
    .nullish(),
  empresaId: z.number().int().positive().nullish(),
  responsavelId: z.number().int().positive().nullish(),
  cor: z.string().nullish(),
})

type EditEventoBody = z.infer<typeof editEventoBodySchema>

@ApiTags('Eventos')
@ApiBearerAuth()
@Controller('/eventos')
@UseGuards(PermissionsGuard)
export class EditEventoController {
  constructor(private editEvento: EditEventoUseCase) {}

  @Patch(':id')
  @HttpCode(204)
  @RequirePermission('eventos', 'edit')
  @ApiOperation({ summary: 'Atualizar evento' })
  async handle(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(editEventoBodySchema)) body: EditEventoBody,
  ) {
    const result = await this.editEvento.execute({ eventoId: id, ...body })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }
  }
}
