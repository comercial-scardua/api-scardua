import {
  Body,
  Controller,
  HttpCode,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { UpdateColaboradorUseCase } from '../../../../domain/uniforme/application/use-cases/update-colaborador'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const updateColaboradorBodySchema = z.object({
  epiCargoId: z.coerce.number().int().nullable().optional(),
  epiObservacoes: z.string().optional(),
})

type UpdateColaboradorBody = z.infer<typeof updateColaboradorBodySchema>

@ApiTags('Uniforme')
@ApiBearerAuth()
@Controller('/uniforme/colaboradores')
@UseGuards(PermissionsGuard)
export class UpdateColaboradorController {
  constructor(private updateColaborador: UpdateColaboradorUseCase) {}

  @Put(':id')
  @HttpCode(200)
  @RequirePermission('uniforme', 'edit')
  @ApiOperation({
    summary: 'Atualizar cargo/observações de uniforme do colaborador',
  })
  async handle(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateColaboradorBodySchema))
    body: UpdateColaboradorBody,
  ) {
    const result = await this.updateColaborador.execute({ id, ...body })
    return result.value
  }
}
